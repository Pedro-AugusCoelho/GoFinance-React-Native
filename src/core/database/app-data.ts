import { getDatabase } from './database'
import { TransactionDTO } from '../../modules/transactions/storage/transaction.dto'
import { UserDTO } from '../../modules/user/storage/user.dto'

export interface AppData {
    user: UserDTO | null
    theme: 'light' | 'dark'
    transactions: TransactionDTO[]
}

interface TransactionRow {
    id: string
    type: 'income' | 'outcome'
    name: string
    value: number
    amount: number
    category: string
    date: string
    plan_id: string | null
    installment_number: number | null
    installment_total: number | null
    status: 'pending' | 'paid'
    import_source: 'nubank' | 'picpay' | null
    external_id: string | null
}

export function transactionFromRow(row: TransactionRow): TransactionDTO {
    return {
        id: row.id,
        type: row.type,
        name: row.name,
        value: row.value,
        amount: row.amount,
        category: row.category,
        date: row.date,
        planId: row.plan_id ?? undefined,
        installmentNumber: row.installment_number ?? undefined,
        installmentTotal: row.installment_total ?? undefined,
        status: row.status,
        importSource: row.import_source ?? undefined,
        externalId: row.external_id ?? undefined,
    }
}

export async function readAppData(): Promise<AppData> {
    const database = await getDatabase()
    const users = await database.getAllAsync<UserDTO>('SELECT id, name, photo FROM users LIMIT 1')
    const rows = await database.getAllAsync<TransactionRow>(
        'SELECT id, type, name, value, amount, category, date, plan_id, installment_number, installment_total, status, import_source, external_id FROM transactions ORDER BY date DESC',
    )
    const theme = await database.getFirstAsync<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        ['theme'],
    )

    const storedUser = users[0]

    return {
        user: storedUser
            ? { ...storedUser, photo: storedUser.photo ?? undefined }
            : null,
        theme: theme?.value === 'dark' ? 'dark' : 'light',
        transactions: rows.map(transactionFromRow),
    }
}
