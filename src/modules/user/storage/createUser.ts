import { getDatabase } from '../../../core/database/database'
import { UserDTO } from './user.dto'
import { toAppError } from '../../../core/errors/app-error'

export async function createUser(newUser: UserDTO) {
    try {
        const database = await getDatabase()
        await database.runAsync(
            'INSERT OR REPLACE INTO users (id, name, photo) VALUES (?, ?, ?)',
            [newUser.id, newUser.name, newUser.photo ?? null],
        )
    } catch (error: unknown) {
        throw toAppError(error, 'USER_SAVE_FAILED', 'Não foi possível criar o usuário.')
    }
}
