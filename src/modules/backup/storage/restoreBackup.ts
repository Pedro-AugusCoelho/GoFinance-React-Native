import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { restoreAppData } from './app-data-restore'
import { parseBackupDocument } from './backup-format'
import { AppError, toAppError } from '../../../core/errors/app-error'
import type { BackupOperationResult } from './createBackup'

export async function restoreBackup(): Promise<BackupOperationResult> {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        })

        if (result.canceled) {
            return { success: false, message: 'Seleção de arquivo cancelada' }
        }

        const backupString = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.UTF8,
        })
        const backup = await parseBackupDocument(JSON.parse(backupString))

        await restoreAppData(backup.data)

        return { success: true, message: 'Backup restaurado com sucesso!' }
    } catch (error: unknown) {
        const appError = error instanceof Error && error.message === 'BACKUP_INVALID'
            ? new AppError('BACKUP_INVALID', 'Formato de backup inválido ou incompatível.', error)
            : error instanceof Error && error.message === 'BACKUP_CHECKSUM_INVALID'
                ? new AppError('BACKUP_INVALID', 'O backup está corrompido.', error)
                : toAppError(error, 'BACKUP_RESTORE_FAILED', 'Não foi possível restaurar o backup.')

        return { success: false, message: appError.message, error: appError }
    }
}
