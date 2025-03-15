import { createContext, useContext, useEffect, useState } from "react";

import uuid from 'react-native-uuid';

import { getUser } from "../storage/user/getuser";
import { UserDTO } from "../storage/user/userStorageDTO";
import { createUser as createUserStorage } from '../storage/user/createUser'
import { setPhotoUser } from "../storage/user/setPhotoUser";
import { setDataUser } from "../storage/user/setDataUser";

interface AuthProviderProps {
    children: React.ReactNode
}
interface IAuthContextData {
    user: UserDTO | null
    isLoadingUser: boolean
    createUser: (data: { name: string }) => void
    savePhotoProfile: (uri: string) => void
    editUser: (user: UserDTO) => void
}

export const AuthContext = createContext({} as IAuthContextData)

function AuthProvider ({children}:AuthProviderProps) {
    const [user, setUser] = useState<UserDTO | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)

    async function getUserStorage () {
        try {
            const user = await getUser()

            if (user) {
                setUser(user)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoadingUser(false)
        }
    }

    async function createUser(data: { name: string }) {
        const newUser: UserDTO = {
            id: uuid.v4(),
            name: data.name,
        }

        // CRIANDO O USUSARIO
        await createUserStorage(newUser)

        // PEGAR O USUARIO ATUALIZADO
        getUserStorage()
    }

    async function savePhotoProfile(uri: string) {
        await setPhotoUser(uri)

        // PEGAR O USUARIO ATUALIZADO
        getUserStorage()
    }

    async function editUser(user: UserDTO) {
        setDataUser(user)

        // PEGAR O USUARIO ATUALIZADO
        getUserStorage()
    }

    useEffect(() => {
        getUserStorage()
    },[])

    return(
        <AuthContext.Provider value={{ user, isLoadingUser, createUser, savePhotoProfile, editUser }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth () {
    const context = useContext(AuthContext);

    return context
}

export { AuthProvider, useAuth }