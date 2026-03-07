import AsyncStorage from '@react-native-async-storage/async-storage'
import { THEME_COLLECTION } from '../storageConfig'
import { ThemeMode } from './themeStorageDTO'

export async function setThemeMode(mode: ThemeMode) {
    await AsyncStorage.setItem(THEME_COLLECTION, mode)
}
