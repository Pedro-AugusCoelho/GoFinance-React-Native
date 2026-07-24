import { addMonths } from 'date-fns'
import { TransactionDTO } from '../storage/transaction.dto'
import { serializeTransactionDate } from './transaction-date'
import { AppError } from '../../../core/errors/app-error'

interface CreateInstallmentPlanParams {
    name: string
    totalValueCents: number
    installments: number
    type: 'income' | 'outcome'
    category: string
    date: Date
    createId: () => string
}

export function createInstallmentPlan({
    name,
    totalValueCents,
    installments,
    type,
    category,
    date,
    createId,
}: CreateInstallmentPlanParams): TransactionDTO[] {
    if (!Number.isInteger(totalValueCents) || totalValueCents <= 0) {
        throw new AppError('INVALID_TRANSACTION_VALUE', 'O valor da transação é inválido.')
    }

    if (!Number.isInteger(installments) || installments < 1) {
        throw new AppError('INVALID_INSTALLMENT_COUNT', 'A quantidade de parcelas é inválida.')
    }

    const baseInstallmentCents = Math.floor(totalValueCents / installments)
    const remainingCents = totalValueCents - baseInstallmentCents * installments
    const planId = createId()

    return Array.from({ length: installments }, (_, index) => ({
        id: createId(),
        name: installments > 1
            ? `${name} - ${String(index + 1).padStart(2, '0')}/${installments}`
            : name,
        value: baseInstallmentCents + (index < remainingCents ? 1 : 0),
        amount: installments,
        type,
        category,
        date: serializeTransactionDate(addMonths(date, index)),
        planId,
        installmentNumber: index + 1,
        installmentTotal: installments,
        status: 'pending',
    }))
}
