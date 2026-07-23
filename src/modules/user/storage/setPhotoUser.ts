import { getDatabase } from '../../../core/database/database'
import { getUser } from './getUser'
import { toAppError } from '../../../core/errors/app-error'

export async function setPhotoUser(uri: string) {
    try {
        const user = await getUser()

        if (user) {
            const database = await getDatabase()
            await database.runAsync('UPDATE users SET photo = ? WHERE id = ?', [uri, user.id])
            return { ...user, photo: uri }
        }

        return user
    } catch (error: unknown) {
        throw toAppError(error, 'USER_SAVE_FAILED', 'Não foi possível atualizar a foto.')
    }
}
