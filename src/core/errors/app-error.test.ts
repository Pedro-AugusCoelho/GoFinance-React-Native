import { AppError, getErrorMessage, toAppError } from './app-error'

describe('application errors', () => {
    it('preserves typed errors and their cause', () => {
        const cause = new Error('sqlite failed')
        const error = toAppError(cause, 'DATABASE_WRITE_FAILED', 'Falha ao gravar.')

        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('DATABASE_WRITE_FAILED')
        expect(error.cause).toBe(cause)
    })

    it('maps technical errors to safe user-facing messages', () => {
        expect(getErrorMessage(new AppError('BACKUP_INVALID', 'invalid')))
            .toContain('backup Plutora válido')
        expect(getErrorMessage(new Error('internal detail')))
            .toBe('Não foi possível concluir a operação.')
    })
})
