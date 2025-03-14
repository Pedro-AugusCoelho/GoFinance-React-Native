import AsyncStorage from "@react-native-async-storage/async-storage"
import { USER_COLLECTION } from "../storageConfig"
import { UserDTO } from "./userStorageDTO"

export async function createUser(newUser: UserDTO) {
    try {
        await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(newUser))
    } catch (error) {
        throw error
    }
}
