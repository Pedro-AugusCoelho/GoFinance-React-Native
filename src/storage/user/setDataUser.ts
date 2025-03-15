import AsyncStorage from "@react-native-async-storage/async-storage"
import { USER_COLLECTION } from "../storageConfig"
import { getUser } from "./getuser"
import { UserDTO } from "./userStorageDTO"


export async function setDataUser(dataUser: UserDTO) {
    try {
        const user = await getUser()

        if (user) {
            user.name = dataUser.name

            await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(user))
        }

        return user
    } catch (error) {
        throw error
    }
}