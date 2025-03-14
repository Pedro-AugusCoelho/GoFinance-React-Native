import AsyncStorage from "@react-native-async-storage/async-storage"
import { USER_COLLECTION } from "../storageConfig"
import { getUser } from "./getuser"

export async function setPhotoUser(uri: string) {
    try {
        const user = await getUser()

        if (user) {
            user.photo = uri

            await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(user))
        }

        return user
    } catch (error) {
        throw error
    }
}