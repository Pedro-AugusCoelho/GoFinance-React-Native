import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { darkTheme, lightTheme } from '../global/styles/theme'
import { getThemeMode } from '../storage/theme/getThemeMode'
import { setThemeMode } from '../storage/theme/setThemeMode'
import { ThemeMode } from '../storage/theme/themeStorageDTO'

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
        } catch (error) {
            console.log(error)
        }
    }

    async function changeTheme(selectedMode: ThemeMode) {
        await setThemeMode(selectedMode)
        setMode(selectedMode)
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
