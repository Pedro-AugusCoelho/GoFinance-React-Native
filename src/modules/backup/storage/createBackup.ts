import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { readAppData } from '../../../core/database/app-data'
import { createBackupDocument } from './backup-format'
import { AppError, toAppError } from '../../../core/errors/app-error'

export interface BackupOperationResult {
    success: boolean
    message: string
    path?: string
    error?: AppError
}

export async function createBackup(): Promise<BackupOperationResult> {
    try {
        const backup = await createBackupDocument(await readAppData())
        const backupString = JSON.stringify(backup, null, 2)
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
        const fileName = `gofinance-backup-v${backup.version}-${timestamp}.json`
        const backupFilePath = FileSystem.documentDirectory + fileName

        await FileSystem.writeAsStringAsync(backupFilePath, backupString, {
            encoding: FileSystem.EncodingType.UTF8,
        })

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(backupFilePath, {
                mimeType: 'application/json',
                dialogTitle: 'Salvar Backup',
                UTI: 'public.json',
            })

            return { success: true, message: 'Backup criado e compartilhado com sucesso!' }
        }

        return { success: true, message: 'Backup criado com sucesso!', path: backupFilePath }
    } catch (error: unknown) {
        const appError = toAppError(error, 'BACKUP_CREATE_FAILED', 'Não foi possível criar o backup.')
        return { success: false, message: appError.message, error: appError }
    }
}
