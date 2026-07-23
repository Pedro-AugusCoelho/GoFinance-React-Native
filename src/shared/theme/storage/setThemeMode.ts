import { getDatabase } from '../../../core/database/database'
import { ThemeMode } from './theme-mode.type'
import { toAppError } from '../../../core/errors/app-error'

export async function setThemeMode(mode: ThemeMode) {
    try {
        const database = await getDatabase()
        await database.runAsync(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            ['theme', mode],
        )
    } catch (error: unknown) {
        throw toAppError(error, 'THEME_SAVE_FAILED', 'Não foi possível salvar o tema.')
    }
}
