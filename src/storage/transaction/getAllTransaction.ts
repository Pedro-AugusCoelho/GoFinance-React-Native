import AsyncStorage from "@react-native-async-storage/async-storage";
import { TRANSACTION_COLLECTION } from "../storageConfig";
import { TransactionDTO } from "./TransactionStorageDTO";


export async function getAllTransactions() {
    try {
        const storage = await AsyncStorage.getItem(TRANSACTION_COLLECTION)
        const transactions: TransactionDTO[] = storage ? JSON.parse(storage) : []

        return transactions
    } catch (error) {
        throw error
    }
}