import { getDatabase } from '../../../core/database/database'
import { TransactionDTO } from './transaction.dto'
import { toAppError } from '../../../core/errors/app-error'

export async function saveTransactions(transactions: TransactionDTO[]) {
    try {
        const database = await getDatabase()

        await database.withExclusiveTransactionAsync(async (transaction) => {
        await transaction.runAsync('DELETE FROM transactions')

        for (const item of transactions) {
            await transaction.runAsync(
                `INSERT INTO transactions
                (id, type, name, value, amount, category, date, plan_id,
                 installment_number, installment_total, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                ],
            )
        }
        })
    } catch (error: unknown) {
        throw toAppError(error, 'DATABASE_WRITE_FAILED', 'Não foi possível salvar as transações.')
    }
}
