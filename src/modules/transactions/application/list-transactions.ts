import { asyncTransactionRepository } from '../storage/async-transaction.repository'
import { TransactionRepository } from '../storage/transaction.repository'
import { TransactionDTO } from '../storage/transaction.dto'

export function listTransactions(
    repository: TransactionRepository = asyncTransactionRepository,
): Promise<TransactionDTO[]> {
    return repository.getAll()
}
