import { asyncTransactionRepository } from '../storage/async-transaction.repository'
import { TransactionRepository } from '../storage/transaction.repository'
import { TransactionDTO } from '../storage/transaction.dto'
import { EditTransactionScope } from './edit-transaction-plan'
import { AppError } from '../../../core/errors/app-error'

function belongsToPlan(transaction: TransactionDTO, planId?: string) {
    return Boolean(planId && transaction.planId === planId)
}

export async function deleteTransactionPlan(
    id: string,
    scope: EditTransactionScope,
    repository: TransactionRepository = asyncTransactionRepository,
): Promise<void> {
    const currentTransactions = await repository.getAll()
    const selectedTransaction = currentTransactions.find((transaction) => transaction.id === id)

    if (!selectedTransaction) {
        throw new AppError('TRANSACTION_NOT_FOUND', 'A transação não foi encontrada.')
    }

    const currentInstallmentNumber = selectedTransaction.installmentNumber || 1
    const planId = selectedTransaction.planId
    const transactions = currentTransactions.filter((transaction) => {
        const isCurrent = transaction.id === id
        const isInPlan = belongsToPlan(transaction, planId)
        const installmentNumber = transaction.installmentNumber || 1

        if (scope === 'one') return !isCurrent
        if (scope === 'future') return !(isInPlan && installmentNumber >= currentInstallmentNumber)
        return !isInPlan
    })

    await repository.save(transactions)
}
