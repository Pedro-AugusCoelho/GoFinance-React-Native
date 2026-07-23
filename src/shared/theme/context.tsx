import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components/native'

import { darkTheme, lightTheme } from './theme'
import { getThemeMode } from './storage/getThemeMode'
import { setThemeMode } from './storage/setThemeMode'
import { ThemeMode } from './storage/theme-mode.type'
import { Alert } from 'react-native'
import { getErrorMessage } from '../../core/errors/app-error'

interface ThemeProviderProps {
    children: React.ReactNode
}

interface ThemeContextData {
    mode: ThemeMode
    isDark: boolean
    changeTheme: (mode: ThemeMode) => Promise<void>
    toggleTheme: () => Promise<void>
}

const ThemeContext = createContext({} as ThemeContextData)

function AppThemeProvider({ children }: ThemeProviderProps) {
    const [mode, setMode] = useState<ThemeMode>('light')

    async function loadThemeMode() {
        try {
            const storageMode = await getThemeMode()
            setMode(storageMode)
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar o tema.'))
        }
    }

    async function changeTheme(selectedMode: ThemeMode) {
        try {
            await setThemeMode(selectedMode)
            setMode(selectedMode)
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível alterar o tema.'))
        }
    }

    async function toggleTheme() {
        const selectedMode = mode === 'light' ? 'dark' : 'light'
        await changeTheme(selectedMode)
    }

    useEffect(() => {
        loadThemeMode()
    }, [])

    const selectedTheme = useMemo(() => {
        return mode === 'dark' ? darkTheme : lightTheme
    }, [mode])

    return (
        <ThemeContext.Provider
            value={{
                mode,
                isDark: mode === 'dark',
                changeTheme,
                toggleTheme,
            }}
        >
            {/* @ts-ignore */}
            <ThemeProvider theme={selectedTheme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    )
}

function useAppTheme() {
    const context = useContext(ThemeContext)

    return context
}

export { AppThemeProvider, useAppTheme }
