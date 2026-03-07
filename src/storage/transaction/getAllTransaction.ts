import AsyncStorage from "@react-native-async-storage/async-storage";
import { TRANSACTION_COLLECTION } from "../storageConfig";
import { TransactionDTO } from "./transactionStorageDTO";

function parseToNumber(value: unknown) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0
    }

    const normalized = String(value ?? '')
        .replace(/\s/g, '')
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
}

export async function getAllTransactions() {
    try {
        const storage = await AsyncStorage.getItem(TRANSACTION_COLLECTION)
        const rawTransactions = storage ? JSON.parse(storage) : []

        const transactions: TransactionDTO[] = rawTransactions.map((transaction: any) => ({
            ...transaction,
            value: parseToNumber(transaction.value),
            amount: Number.isFinite(Number(transaction.amount)) ? Number(transaction.amount) : 1,
        }))

        const hasLegacyData = rawTransactions.some((transaction: any) =>
            typeof transaction.value !== 'number' || typeof transaction.amount !== 'number'
        )

        if (hasLegacyData) {
            await AsyncStorage.setItem(TRANSACTION_COLLECTION, JSON.stringify(transactions))
        }

        return transactions
    } catch (error) {
        throw error
    }
}