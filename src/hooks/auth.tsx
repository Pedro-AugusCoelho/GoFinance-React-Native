import { createContext, useContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import uuid from 'react-native-uuid';

interface AuthProviderProps {
    children: React.ReactNode
}

interface FormData {
    email:string;
    password:string;
}

interface User {
    id: string;
    name: string;
    password: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signIn: (form: FormData) => void;
}

export const AuthContext = createContext({} as IAuthContextData);

function AuthProvider ({children}:AuthProviderProps) {
    const dataKey = '@gofinances:user';
    const [user, setUser] = useState({} as User)

    async function signIn(form: FormData) {
        //
    }

    return(
        <AuthContext.Provider value={{user, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth () {
    const context = useContext(AuthContext);

    return context
}

export { AuthProvider, useAuth}