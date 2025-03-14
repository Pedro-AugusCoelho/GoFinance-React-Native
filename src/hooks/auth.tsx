import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import uuid from 'react-native-uuid';
import { getUser } from "../storage/user/getuser";
import { UserDTO } from "../storage/user/userStorageDTO";
import { createUser as createUserStorage } from '../storage/user/createUser'

interface AuthProviderProps {
    children: React.ReactNode
}

interface FormData {
    name: string;
}

interface User {
    id: string;
    name: string;
    photo?: string;
}

interface IAuthContextData {
    user: User | null
    createUser: (data: { name: string }) => void
}

export const AuthContext = createContext({} as IAuthContextData)

function AuthProvider ({children}:AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)

    async function getUserStorage () {
        const user = await getUser()

        if (user) {
            setUser(user)
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

    useEffect(() => {
        getUserStorage()
    },[])

    return(
        <AuthContext.Provider value={{ user, createUser }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth () {
    const context = useContext(AuthContext);

    return context
}

export { AuthProvider, useAuth }