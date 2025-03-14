import { getAllTransactions } from "./getAllTransaction"
import { TransactionDTO } from "./transactionStorageDTO"

export async function getTransactionsByDay(year?: number, month?: number, day?: number) {
    try {
        const transactions: TransactionDTO[] = await getAllTransactions()

        // Se não for informado o ano, usa o ano atual
        const targetYear = year || new Date().getFullYear()
        // Se não for informado o mês, usa o mês atual (1-12)
        const targetMonth = month !== undefined ? month : new Date().getMonth() + 1
        // Se não for informado o dia, usa o dia atual
        const targetDay = day !== undefined ? day : new Date().getDate()

        // Filtra as transações pelo ano, mês e dia, e ordena por data
        const filteredTransactions = transactions
            .filter((transaction) => {
                const transactionDate = new Date(transaction.date)
                const transactionYear = transactionDate.getFullYear()
                const transactionMonth = transactionDate.getMonth() + 1 // O mês começa em 0
                const transactionDay = transactionDate.getDate()

                return (
                    transactionYear === targetYear &&
                    transactionMonth === targetMonth &&
                    transactionDay === targetDay
                )
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ordenação por data

        return filteredTransactions
    } catch (error) {
        throw error
    }
}
