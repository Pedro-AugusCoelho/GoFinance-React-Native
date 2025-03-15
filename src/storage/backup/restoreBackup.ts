import * as FileSystem from 'expo-file-system'

import AsyncStorage from "@react-native-async-storage/async-storage"

const backupFilePath = FileSystem.documentDirectory + 'backup.json';

export async function restoreBackup() {
    try {
    // Lê o arquivo de backup
    const backupString = await FileSystem.readAsStringAsync(backupFilePath, {
        encoding: FileSystem.EncodingType.UTF8,
    })

    const backup = JSON.parse(backupString)

    // Converte o objeto de backup para o formato aceito pelo AsyncStorage.multiSet
    const items = Object.keys(backup).map((key) => [key, backup[key]])
    
    // @ts-ignore
    await AsyncStorage.multiSet(items)

    } catch (error) {
        console.error('Erro ao restaurar arquivo de backup:', error)
    }
}