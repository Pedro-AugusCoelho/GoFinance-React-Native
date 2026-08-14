import { AppError } from '../../../core/errors/app-error'
import { ImportSource } from './import-source'
import { normalizeHeader, parseCsv } from './parse-csv'

export function detectStatementProvider(content: string): ImportSource {
    const rows = parseCsv(content)
    const header = normalizeHeader(rows[0] ?? [])

    if (header.includes('identificador') && header.includes('descrição')) {
        return 'nubank'
    }

    if (header.includes('hora') && header.includes('origem / destino')) {
        return 'picpay'
    }

    throw new AppError(
        'STATEMENT_UNSUPPORTED_FORMAT',
        'Este arquivo não é um extrato Nubank ou PicPay suportado.',
    )
}
