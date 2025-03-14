import { getAllTransactions } from "./getAllTransaction"
import { TransactionDTO } from "./transactionStorageDTO"

export async function getTransactionsByYear(year?: number) {
    try {
        const transactions: TransactionDTO[] = await getAllTransactions()

        // Se não for informado o ano, usa o ano atual
        const targetYear = year || new Date().getFullYear()

        // Filtra as transações pelo ano e ordena por data (do mais antigo para o mais recente)
        const filteredTransactions = transactions
            .filter((transaction) => {
                const transactionYear = new Date(transaction.date).getFullYear()
                return transactionYear === targetYear
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ordenação por data

        return filteredTransactions
    } catch (error) {
        throw error
    }
}
