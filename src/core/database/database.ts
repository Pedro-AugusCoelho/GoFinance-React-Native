import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite'
import AsyncStorage from '../storage/asyncStorage'
import {
    THEME_COLLECTION,
    TRANSACTION_COLLECTION,
    USER_COLLECTION,
} from '../storage/storageConfig'
import { TransactionDTO } from '../../modules/transactions/storage/transaction.dto'
import { UserDTO } from '../../modules/user/storage/user.dto'
import { toAppError } from '../errors/app-error'

const DATABASE_NAME = 'gofinance.db'
const SCHEMA_VERSION = 2

let databasePromise: Promise<SQLiteDatabase> | null = null

function parseLegacyNumber(value: unknown, fallback = 0) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : fallback
    }

    const normalized = String(value ?? '')
        .replace(/\s/g, '')
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
    const parsed = Number(normalized)

    return Number.isFinite(parsed) ? parsed : fallback
}

async function migrateLegacyStorage(database: SQLiteDatabase) {
    const schema = await database.getFirstAsync<{ value: string }>(
        'SELECT value FROM metadata WHERE key = ?',
        ['schema_version'],
    )

    if (schema?.value) {
        return
    }

    const [legacyUser, legacyTransactions, legacyTheme] = await AsyncStorage.multiGet([
        USER_COLLECTION,
        TRANSACTION_COLLECTION,
        THEME_COLLECTION,
    ])

    await database.withExclusiveTransactionAsync(async (transaction) => {
        if (legacyUser[1]) {
            const user = JSON.parse(legacyUser[1]) as UserDTO
            await transaction.runAsync(
                'INSERT OR REPLACE INTO users (id, name, photo) VALUES (?, ?, ?)',
                [user.id, user.name, user.photo ?? null],
            )
        }

        if (legacyTransactions[1]) {
            const legacyItems = JSON.parse(legacyTransactions[1]) as Array<Record<string, unknown>>
            const transactions = legacyItems.map((item) => ({
                ...item,
                value: parseLegacyNumber(item.value),
                amount: parseLegacyNumber(item.amount, 1),
            })) as unknown as TransactionDTO[]

            for (const item of transactions) {
                await transaction.runAsync(
                    `INSERT OR REPLACE INTO transactions
                    (id, type, name, value, amount, category, date, plan_id,
                     installment_number, installment_total, status, import_source, external_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        item.id,
                        item.type,
                        item.name,
                        item.value,
                        item.amount,
                        item.category,
                        item.date,
                        item.planId ?? null,
                        item.installmentNumber ?? null,
                        item.installmentTotal ?? null,
                        item.status ?? 'pending',
                        item.importSource ?? null,
                        item.externalId ?? null,
                    ],
                )
            }
        }

        if (legacyTheme[1] === 'dark' || legacyTheme[1] === 'light') {
            await transaction.runAsync(
                'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
                ['theme', legacyTheme[1]],
            )
        }

        await transaction.runAsync(
            'INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)',
            ['schema_version', String(SCHEMA_VERSION)],
        )
    })

    await AsyncStorage.multiRemove([
        USER_COLLECTION,
        TRANSACTION_COLLECTION,
        THEME_COLLECTION,
    ])
}

async function initializeDatabase(): Promise<SQLiteDatabase> {
    const database = await openDatabaseAsync(DATABASE_NAME)

    await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS metadata (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            photo TEXT
        );
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('income', 'outcome')),
            name TEXT NOT NULL,
            value REAL NOT NULL,
            amount INTEGER NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            plan_id TEXT,
            installment_number INTEGER,
            installment_total INTEGER,
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
            import_source TEXT,
            external_id TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
        CREATE INDEX IF NOT EXISTS idx_transactions_plan_id ON transactions(plan_id);
    `)

    await migrateLegacyStorage(database)
    await migrateNativeSchema(database)
    return database
}

async function migrateNativeSchema(database: SQLiteDatabase) {
    const columns = await database.getAllAsync<{ name: string }>(
        'PRAGMA table_info(transactions)',
    )
    const columnNames = new Set(columns.map((column) => column.name))

    if (!columnNames.has('import_source')) {
        await database.execAsync('ALTER TABLE transactions ADD COLUMN import_source TEXT')
    }

    if (!columnNames.has('external_id')) {
        await database.execAsync('ALTER TABLE transactions ADD COLUMN external_id TEXT')
    }

    await database.execAsync(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_import_identity
        ON transactions(import_source, external_id)
        WHERE import_source IS NOT NULL AND external_id IS NOT NULL
    `)

    await database.runAsync(
        'INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)',
        ['schema_version', String(SCHEMA_VERSION)],
    )
}

export function getDatabase(): Promise<SQLiteDatabase> {
    if (!databasePromise) {
        databasePromise = initializeDatabase().catch((error: unknown) => {
            databasePromise = null
            throw toAppError(error, 'DATABASE_UNAVAILABLE', 'Não foi possível abrir o banco local.')
        })
    }

    return databasePromise
}

export { DATABASE_NAME, SCHEMA_VERSION }
