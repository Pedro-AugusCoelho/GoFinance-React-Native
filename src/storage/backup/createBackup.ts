import * as FileSystem from 'expo-file-system'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { TRANSACTION_COLLECTION, USER_COLLECTION } from '../storageConfig';

// DEFINA O CAMINHO PARA O ARQUIVO DE BACKUP NO DIRETÓRIO DE DOCUMENTOS DO APP
const backupFilePath = FileSystem.documentDirectory + 'backup.json'

// FUNÇÃO PARA CRIAR UM BACKUP DE TODOS OS DADOS DO ASYNCSTORAGE
export async function createBackup() {
    try {
        // OBTÉM TODAS AS CHAVES DO ASYNCSTORAGE
        const keys = await AsyncStorage.getAllKeys()
        const items = await AsyncStorage.multiGet(keys)
        const backup = {}

        // CONSTRÓI UM OBJETO COM OS DADOS
        items.forEach(([key, value]) => {
            // @ts-ignore
            backup[key] = value
        })

        const backupString = JSON.stringify(backup, null, 2)

        // ESCREVE O JSON EM UM ARQUIVO
        await FileSystem.writeAsStringAsync(backupFilePath, backupString, {
            encoding: FileSystem.EncodingType.UTF8,
        })

        return backupString

    } catch (err) {
        console.error('ERRO BACKUP', err);
    }
}