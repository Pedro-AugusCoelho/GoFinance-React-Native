import { getAllTransactions } from "./getAllTransactions"
import { TransactionDTO } from "./transaction.dto"
import { getCurrentDate } from '../domain/transaction-date'

export async function getTransactionsByYear(year?: number) {
    const transactions: TransactionDTO[] = await getAllTransactions()

        // Se não for informado o ano, usa o ano atual
        const targetYear = year || getCurrentDate().getFullYear()

        // Filtra as transações pelo ano e ordena por data (do mais antigo para o mais recente)
        const filteredTransactions = transactions
            .filter((transaction) => {
                const transactionYear = new Date(transaction.date).getFullYear()
                return transactionYear === targetYear
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ordenação por data

    return filteredTransactions
}
