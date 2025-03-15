import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from "./userStorageDTO";
import { USER_COLLECTION } from "../storageConfig";

export async function getUser() {
    try {
        const storage = await AsyncStorage.getItem(USER_COLLECTION)
        const user: UserDTO = storage ? JSON.parse(storage) : null

        return user
    } catch (error) {
        throw error
    }
}