import { createContext, useContext, useEffect, useState } from "react";

import uuid from 'react-native-uuid';

import { getUser } from "../storage/getUser";
import { UserDTO } from "../storage/user.dto";
import { createUser as createUserStorage } from '../storage/createUser'
import { setPhotoUser } from "../storage/setPhotoUser";
import { setDataUser } from "../storage/setDataUser";
import { Alert } from 'react-native'
import { getErrorMessage } from '../../../core/errors/app-error'

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
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar o perfil.'))
        } finally {
            setIsLoadingUser(false)
        }
    }

    async function createUser(data: { name: string }) {
        const newUser: UserDTO = {
            id: uuid.v4(),
            name: data.name,
        }

        await createUserStorage(newUser)
        setUser(newUser)
    }

    async function savePhotoProfile(uri: string) {
        const updatedUser = await setPhotoUser(uri)
        if (updatedUser) {
            setUser(updatedUser)
        }
    }

    async function editUser(user: UserDTO) {
        const updatedUser = await setDataUser(user)
        if (updatedUser) {
            setUser(updatedUser)
        }
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
