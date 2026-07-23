import { getDatabase } from '../../../core/database/database'
import { UserDTO } from './user.dto'
import { toAppError } from '../../../core/errors/app-error'

export async function getUser() {
    try {
        const database = await getDatabase()
        const user = await database.getFirstAsync<UserDTO>(
            'SELECT id, name, photo FROM users LIMIT 1',
        )

        return user ?? null
    } catch (error: unknown) {
        throw toAppError(error, 'USER_LOAD_FAILED', 'Não foi possível carregar o usuário.')
    }
}
