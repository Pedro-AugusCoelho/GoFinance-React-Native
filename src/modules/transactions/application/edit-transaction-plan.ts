import { addMonths } from 'date-fns'
import { asyncTransactionRepository } from '../storage/async-transaction.repository'
import { TransactionRepository } from '../storage/transaction.repository'
import { TransactionDTO } from '../storage/transaction.dto'
import { AppError } from '../../../core/errors/app-error'
import { serializeTransactionDate } from '../domain/transaction-date'

export type EditTransactionScope = 'one' | 'future' | 'all'

interface EditTransactionPlanInput {
    id: string
    scope: EditTransactionScope
    name: string
    valueCents: number
    type: 'income' | 'outcome'
    category: string
    date: Date
}

function belongsToPlan(transaction: TransactionDTO, planId?: string) {
    return Boolean(planId && transaction.planId === planId)
}

export async function editTransactionPlan(
    input: EditTransactionPlanInput,
    repository: TransactionRepository = asyncTransactionRepository,
): Promise<void> {
    const currentTransactions = await repository.getAll()
    const selectedTransaction = currentTransactions.find(({ id }) => id === input.id)

    if (!selectedTransaction) {
        throw new AppError('TRANSACTION_NOT_FOUND', 'A transação não foi encontrada.')
    }

    const currentInstallmentNumber = selectedTransaction.installmentNumber || 1
    const planId = selectedTransaction.planId

    const transactions = currentTransactions.map((transaction) => {
        const isCurrent = transaction.id === input.id
        const isInPlan = belongsToPlan(transaction, planId)
        const installmentNumber = transaction.installmentNumber || 1

        const shouldEdit = input.scope === 'one'
            ? isCurrent
            : input.scope === 'future'
                ? isInPlan && installmentNumber >= currentInstallmentNumber
                : isInPlan

        if (!shouldEdit) {
            return transaction
        }

        const offset = installmentNumber - currentInstallmentNumber
        const nextDate = input.scope === 'one'
            ? input.date
            : addMonths(input.date, offset)

        return {
            ...transaction,
            name: input.name,
            value: input.valueCents,
            type: input.type,
            category: input.category,
            date: serializeTransactionDate(nextDate),
        }
    })

    await repository.save(transactions)
}
