export type AppErrorCode =
    | 'DATABASE_UNAVAILABLE'
    | 'DATABASE_READ_FAILED'
    | 'DATABASE_WRITE_FAILED'
    | 'BACKUP_CREATE_FAILED'
    | 'BACKUP_FILE_READ_FAILED'
    | 'BACKUP_INVALID'
    | 'INVALID_TRANSACTION_VALUE'
    | 'INVALID_INSTALLMENT_COUNT'
    | 'INVALID_TRANSACTION_DATE'
    | 'BACKUP_RESTORE_FAILED'
    | 'TRANSACTION_NOT_FOUND'
    | 'USER_LOAD_FAILED'
    | 'USER_SAVE_FAILED'
    | 'THEME_LOAD_FAILED'
    | 'THEME_SAVE_FAILED'
    | 'STATEMENT_FILE_READ_FAILED'
    | 'STATEMENT_UNSUPPORTED_FORMAT'
    | 'STATEMENT_PARSE_FAILED'
    | 'STATEMENT_IMPORT_FAILED'
    | 'UNKNOWN'

export class AppError extends Error {
    readonly code: AppErrorCode
    readonly cause?: unknown

    constructor(code: AppErrorCode, message: string, cause?: unknown) {
        super(message)
        this.name = 'AppError'
        this.code = code
        this.cause = cause
    }
}

export function toAppError(
    error: unknown,
    code: AppErrorCode = 'UNKNOWN',
    message = 'Ocorreu um erro inesperado.',
): AppError {
    if (error instanceof AppError) {
        return error
    }

    return new AppError(code, message, error)
}

export function getErrorMessage(error: unknown, fallback = 'Não foi possível concluir a operação.') {
    const appError = toAppError(error, 'UNKNOWN', fallback)

    switch (appError.code) {
        case 'BACKUP_INVALID':
            return 'O arquivo não é um backup Plutora válido ou é incompatível com esta versão.'
        case 'BACKUP_FILE_READ_FAILED':
            return 'Não foi possível ler o arquivo selecionado.'
        case 'BACKUP_RESTORE_FAILED':
            return 'Não foi possível restaurar o backup. Seus dados atuais foram preservados.'
        case 'BACKUP_CREATE_FAILED':
            return 'Não foi possível criar ou compartilhar o backup.'
        case 'DATABASE_UNAVAILABLE':
        case 'DATABASE_READ_FAILED':
        case 'DATABASE_WRITE_FAILED':
            return 'Não foi possível acessar os dados locais. Tente novamente.'
        case 'TRANSACTION_NOT_FOUND':
            return 'A transação não foi encontrada. Atualize a tela e tente novamente.'
        case 'INVALID_TRANSACTION_VALUE':
            return 'Informe um valor de transação maior que zero.'
        case 'INVALID_INSTALLMENT_COUNT':
            return 'Informe uma quantidade válida de parcelas.'
        case 'INVALID_TRANSACTION_DATE':
            return 'Informe uma data válida.'
        case 'USER_LOAD_FAILED':
        case 'USER_SAVE_FAILED':
            return 'Não foi possível salvar ou carregar o perfil.'
        case 'THEME_LOAD_FAILED':
        case 'THEME_SAVE_FAILED':
            return 'Não foi possível atualizar o tema.'
        case 'STATEMENT_FILE_READ_FAILED':
            return 'Não foi possível ler o arquivo selecionado.'
        case 'STATEMENT_UNSUPPORTED_FORMAT':
            return appError.message || 'Este arquivo não é um extrato Nubank ou PicPay suportado.'
        case 'STATEMENT_PARSE_FAILED':
            return 'Não foi possível interpretar o extrato. Verifique o arquivo e tente novamente.'
        case 'STATEMENT_IMPORT_FAILED':
            return 'Não foi possível importar o extrato. Seus dados atuais foram preservados.'
        default:
            return appError.message || fallback
    }
}
