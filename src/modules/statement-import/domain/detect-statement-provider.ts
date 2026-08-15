import { AppError } from '../../../core/errors/app-error'
import { ImportSource } from './import-source'
import { normalizeHeader, parseCsv } from './parse-csv'

export function detectStatementProvider(content: string): ImportSource {
    const rows = parseCsv(content)
    const header = normalizeHeader(rows[0] ?? [])

    if (header.includes('date') && header.includes('title') && header.includes('amount')) {
        return 'nubank'
    }

    // PicPay desabilitado: fatura do cartão só disponível em PDF por enquanto.
    // if (header.includes('hora') && header.includes('origem / destino')) {
    //     return 'picpay'
    // }

    throw new AppError(
        'STATEMENT_UNSUPPORTED_FORMAT',
        'Este arquivo não parece ser uma fatura Nubank.',
    )
}
