import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { toAppError } from '../../../core/errors/app-error'

export interface PickedStatementFile {
    content: string
}

export async function pickStatementFile(): Promise<PickedStatementFile | null> {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['text/csv', 'text/comma-separated-values', 'text/plain'],
            copyToCacheDirectory: true,
        })

        if (result.canceled) {
            return null
        }

        const content = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.UTF8,
        })

        return { content }
    } catch (error: unknown) {
        throw toAppError(error, 'STATEMENT_FILE_READ_FAILED', 'Não foi possível ler o arquivo selecionado.')
    }
}
