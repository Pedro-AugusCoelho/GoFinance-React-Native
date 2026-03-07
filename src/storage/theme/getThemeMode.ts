import AsyncStorage from '@react-native-async-storage/async-storage'
import { THEME_COLLECTION } from '../storageConfig'
import { ThemeMode } from './themeStorageDTO'

export async function getThemeMode() {
    const mode = await AsyncStorage.getItem(THEME_COLLECTION)

    if (mode === 'dark' || mode === 'light') {
        return mode as ThemeMode
    }

    return 'light' as ThemeMode
}
