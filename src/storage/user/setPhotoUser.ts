import AsyncStorage from "@react-native-async-storage/async-storage"
import { USER_COLLECTION } from "../storageConfig"
import { UserDTO } from "./userStorageDTO"

export async function setPhotoUser(uri: string) {
    try {
        const storage = await AsyncStorage.getItem(USER_COLLECTION)
        const user: UserDTO = storage ? JSON.parse(storage) : null

        user.photo = uri

        await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(user))

        return user
    } catch (error) {
        throw error
    }
}