import { readAppData } from '../../../core/database/app-data'
import { toAppError } from '../../../core/errors/app-error'

export async function getAllTransactions() {
    try {
        const { transactions } = await readAppData()
        return transactions
    } catch (error: unknown) {
        throw toAppError(error, 'DATABASE_READ_FAILED', 'Não foi possível ler as transações.')
    }
}
