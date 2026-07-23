import { TransactionDTO } from '../storage/transaction.dto'
import { parseTransactionDate } from './transaction-date'

export function filterTransactionsByPeriod(
    transactions: TransactionDTO[],
    startDate: Date,
    endDate: Date,
) {
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endDate) {
        return []
    }

    const normalizedStartDate = new Date(startDate)
    normalizedStartDate.setHours(0, 0, 0, 0)

    const normalizedEndDate = new Date(endDate)
    normalizedEndDate.setHours(23, 59, 59, 999)

    return transactions
        .filter((transaction) => {
            const transactionDate = parseTransactionDate(transaction.date)
            return Boolean(
                transactionDate &&
                transactionDate >= normalizedStartDate &&
                transactionDate <= normalizedEndDate,
            )
        })
        .sort((a, b) => {
            const dateA = parseTransactionDate(a.date)?.getTime() ?? 0
            const dateB = parseTransactionDate(b.date)?.getTime() ?? 0
            return dateB - dateA
        })
}
