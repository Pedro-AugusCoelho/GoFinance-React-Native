import { TransactionDTO } from './transaction.dto'

export interface TransactionRepository {
    getAll(): Promise<TransactionDTO[]>
    save(transactions: TransactionDTO[]): Promise<void>
}
