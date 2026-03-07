import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function restoreBackup() {
    try {
        // ABRE O SELETOR DE DOCUMENTOS PARA O USUÁRIO ESCOLHER O ARQUIVO
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true
        })

        // VERIFICA SE O USUÁRIO CANCELOU
        if (result.canceled) {
            return { success: false, message: 'Seleção de arquivo cancelada' }
        }

        // @ts-ignore
        const fileUri = result.assets ? result.assets[0].uri : result.uri

        // LÊ O ARQUIVO SELECIONADO
        const backupString = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.UTF8,
        })

        const backup = JSON.parse(backupString)

        // VALIDA SE O BACKUP TEM DADOS
        if (!backup || Object.keys(backup).length === 0) {
            return { success: false, message: 'Arquivo de backup vazio ou inválido' }
        }

        // CONVERTE O OBJETO DE BACKUP PARA O FORMATO ACEITO PELO ASYNCSTORAGE.MULTISET
        const items = Object.keys(backup).map((key) => [key, backup[key]])
        
        // LIMPA O ASYNCSTORAGE ANTES DE RESTAURAR (OPCIONAL)
        // await AsyncStorage.clear()
        
        // @ts-ignore
        await AsyncStorage.multiSet(items)

        return { success: true, message: 'Backup restaurado com sucesso!' }

    } catch (error) {
        console.error('Erro ao restaurar arquivo de backup:', error)
        return { 
            success: false, 
            message: 'Erro ao restaurar backup. Verifique se o arquivo é válido.', 
            error 
        }
    }
}