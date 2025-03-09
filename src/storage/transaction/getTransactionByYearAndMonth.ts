import { getAllTransactions } from "./getAllTransaction"
import { TransactionDTO } from "./TransactionStorageDTO"

export async function getTransactionsByMonth(year?: number, month?: number) {
    try {
        const transactions: TransactionDTO[] = await getAllTransactions()

        // Se não for informado o ano, usa o ano atual
        const targetYear = year || new Date().getFullYear()
        // Se não for informado o mês, usa o mês atual (1-12)
        const targetMonth = month !== undefined ? month : new Date().getMonth() + 1

        // Filtra as transações pelo ano e mês e ordena por data
        const filteredTransactions = transactions
            .filter((transaction) => {
                const transactionDate = new Date(transaction.date)
                const transactionYear = transactionDate.getFullYear()
                const transactionMonth = transactionDate.getMonth() + 1 // O mês começa em 0

                return transactionYear === targetYear && transactionMonth === targetMonth
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ordenação por data

        return filteredTransactions
    } catch (error) {
        throw error
    }
}
