import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TRANSACTION_COLLECTION, USER_COLLECTION } from '../storageConfig';

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

        // CRIA UM NOME DE ARQUIVO COM DATA E HORA ATUAL
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
        const fileName = `gofinance-backup-${timestamp}.json`
        const backupFilePath = FileSystem.documentDirectory + fileName

        // ESCREVE O JSON EM UM ARQUIVO
        await FileSystem.writeAsStringAsync(backupFilePath, backupString, {
            encoding: FileSystem.EncodingType.UTF8,
        })

        // VERIFICA SE O COMPARTILHAMENTO ESTÁ DISPONÍVEL
        const isSharingAvailable = await Sharing.isAvailableAsync()
        
        if (isSharingAvailable) {
            // COMPARTILHA O ARQUIVO
            await Sharing.shareAsync(backupFilePath, {
                mimeType: 'application/json',
                dialogTitle: 'Salvar Backup',
                UTI: 'public.json'
            })
            
            return { success: true, message: 'Backup criado e compartilhado com sucesso!' }
        } else {
            return { 
                success: true, 
                message: 'Backup criado com sucesso!',
                path: backupFilePath 
            }
        }

    } catch (err) {
        console.error('ERRO BACKUP', err);
        return { success: false, message: 'Erro ao criar backup', error: err }
    }
}