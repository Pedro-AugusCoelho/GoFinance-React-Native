import { getAllTransactions } from './getAllTransactions'
import { saveTransactions } from './saveTransactions'
import { TransactionRepository } from './transaction.repository'

export const asyncTransactionRepository: TransactionRepository = {
    getAll: getAllTransactions,
    save: saveTransactions,
}
