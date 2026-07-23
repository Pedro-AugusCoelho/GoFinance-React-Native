import { getDatabase } from '../../../core/database/database'
import { ThemeMode } from './theme-mode.type'
import { toAppError } from '../../../core/errors/app-error'

export async function getThemeMode() {
    try {
        const database = await getDatabase()
        const setting = await database.getFirstAsync<{ value: string }>(
            'SELECT value FROM settings WHERE key = ?',
            ['theme'],
        )

        return setting?.value === 'dark' ? 'dark' as ThemeMode : 'light' as ThemeMode
    } catch (error: unknown) {
        throw toAppError(error, 'THEME_LOAD_FAILED', 'Não foi possível carregar o tema.')
    }
}
