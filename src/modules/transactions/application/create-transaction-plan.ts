import { createInstallmentPlan } from '../domain/transaction-installments'
import { asyncTransactionRepository } from '../storage/async-transaction.repository'
import { TransactionRepository } from '../storage/transaction.repository'
import { TransactionDTO } from '../storage/transaction.dto'

interface CreateTransactionPlanInput {
    name: string
    totalValue: number
    installments: number
    type: 'income' | 'outcome'
    category: string
    date: Date
    createId: () => string
}

export async function createTransactionPlan(
    input: CreateTransactionPlanInput,
    repository: TransactionRepository = asyncTransactionRepository,
): Promise<TransactionDTO[]> {
    const currentTransactions = await repository.getAll()
    const newTransactions = createInstallmentPlan(input)
    const transactions = [...currentTransactions, ...newTransactions]

    await repository.save(transactions)

    return newTransactions
}
