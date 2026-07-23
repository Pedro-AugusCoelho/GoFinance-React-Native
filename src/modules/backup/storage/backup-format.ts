import { AppData } from '../../../core/database/app-data'
import { TransactionDTO } from '../../transactions/storage/transaction.dto'
import { UserDTO } from '../../user/storage/user.dto'
import * as Crypto from 'expo-crypto'
import { parseTransactionDate } from '../../transactions/domain/transaction-date'

export const BACKUP_FORMAT = 'gofinance-backup'
export const BACKUP_VERSION = 1

export interface BackupDocument {
    format: typeof BACKUP_FORMAT
    version: typeof BACKUP_VERSION
    exportedAt: string
    checksum: string
    data: AppData
}

async function checksumData(data: AppData): Promise<string> {
    return Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        JSON.stringify(data),
    )
}

function isUser(value: unknown): value is UserDTO {
    if (!value || typeof value !== 'object') return false
    const user = value as Record<string, unknown>
    return typeof user.id === 'string' && typeof user.name === 'string' &&
        (user.photo === undefined || user.photo === null || typeof user.photo === 'string')
}

function isTransaction(value: unknown): value is TransactionDTO {
    if (!value || typeof value !== 'object') return false
    const transaction = value as Record<string, unknown>
    return typeof transaction.id === 'string' &&
        (transaction.type === 'income' || transaction.type === 'outcome') &&
        typeof transaction.name === 'string' && typeof transaction.value === 'number' &&
        Number.isFinite(transaction.value) && typeof transaction.amount === 'number' &&
        Number.isInteger(transaction.amount) && transaction.amount > 0 &&
        typeof transaction.category === 'string' && typeof transaction.date === 'string' &&
        parseTransactionDate(transaction.date) !== null &&
        (transaction.planId === undefined || typeof transaction.planId === 'string') &&
        isOptionalPositiveInteger(transaction.installmentNumber) &&
        isOptionalPositiveInteger(transaction.installmentTotal) &&
        (transaction.status === undefined || transaction.status === 'pending' || transaction.status === 'paid')
}

function isOptionalPositiveInteger(value: unknown): boolean {
    return value === undefined || (typeof value === 'number' && Number.isInteger(value) && value > 0)
}

export async function createBackupDocument(data: AppData): Promise<BackupDocument> {
    return {
        format: BACKUP_FORMAT,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        checksum: await checksumData(data),
        data,
    }
}

export async function parseBackupDocument(value: unknown): Promise<BackupDocument> {
    if (!value || typeof value !== 'object') {
        throw new Error('BACKUP_INVALID')
    }

    const document = value as Record<string, unknown>
    const data = document.data as Record<string, unknown> | undefined

    if (document.format !== BACKUP_FORMAT || document.version !== BACKUP_VERSION ||
        typeof document.exportedAt !== 'string' || typeof document.checksum !== 'string' || !data ||
        (data.user !== null && !isUser(data.user)) ||
        (data.theme !== 'light' && data.theme !== 'dark') ||
        !Array.isArray(data.transactions) || !data.transactions.every(isTransaction)) {
        throw new Error('BACKUP_INVALID')
    }

    const expectedChecksum = await checksumData(data as unknown as AppData)
    if (document.checksum !== expectedChecksum) {
        throw new Error('BACKUP_CHECKSUM_INVALID')
    }

    return document as unknown as BackupDocument
}
