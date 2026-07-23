import { getDatabase } from '../../../core/database/database'
import { getUser } from './getUser'
import { UserDTO } from './user.dto'
import { toAppError } from '../../../core/errors/app-error'

export async function setDataUser(dataUser: UserDTO) {
    try {
        const user = await getUser()

        if (user) {
            const database = await getDatabase()
            await database.runAsync('UPDATE users SET name = ? WHERE id = ?', [dataUser.name, user.id])
            return { ...user, name: dataUser.name }
        }

        return user
    } catch (error: unknown) {
        throw toAppError(error, 'USER_SAVE_FAILED', 'Não foi possível atualizar o usuário.')
    }
}
