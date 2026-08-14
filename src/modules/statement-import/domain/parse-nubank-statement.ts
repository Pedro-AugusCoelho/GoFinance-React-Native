import { AppError } from '../../../core/errors/app-error'
import { parseTransactionDate, serializeTransactionDate } from '../../transactions/domain/transaction-date'
import { parseTransactionValue, toAbsoluteCents } from '../../transactions/domain/transaction-money'
import { normalizeHeader, parseCsv } from './parse-csv'
import { StatementEntry, StatementParseResult } from './statement-entry'

function headerIndex(header: string[], name: string): number {
    return header.indexOf(name)
}

export function parseNubankStatement(content: string): StatementParseResult {
    const rows = parseCsv(content)
    const header = normalizeHeader(rows[0] ?? [])
    const dateIndex = headerIndex(header, 'data')
    const valueIndex = headerIndex(header, 'valor')
    const idIndex = headerIndex(header, 'identificador')
    const descriptionIndex = headerIndex(header, 'descrição')

    if (dateIndex < 0 || valueIndex < 0 || idIndex < 0 || descriptionIndex < 0) {
        throw new AppError(
            'STATEMENT_UNSUPPORTED_FORMAT',
            'Este arquivo não parece ser um extrato Nubank.',
        )
    }

    const entries: StatementEntry[] = []
    let ignoredIncomeCount = 0
    const dataRows = rows.slice(1)

    for (const row of dataRows) {
        const signedValue = parseTransactionValue(row[valueIndex] ?? '')
        if (signedValue === null) {
            throw new AppError('STATEMENT_PARSE_FAILED', 'Não foi possível interpretar o extrato.')
        }

        if (signedValue >= 0) {
            ignoredIncomeCount += 1
            continue
        }

        const date = parseTransactionDate(row[dateIndex] ?? '')
        const externalId = (row[idIndex] ?? '').trim()
        const name = (row[descriptionIndex] ?? '').trim()

        if (!date || !externalId || !name) {
            throw new AppError('STATEMENT_PARSE_FAILED', 'Não foi possível interpretar o extrato.')
        }

        entries.push({
            importSource: 'nubank',
            externalId,
            name,
            date: serializeTransactionDate(date),
            valueCents: toAbsoluteCents(signedValue),
        })
    }

    return {
        importSource: 'nubank',
        totalRows: dataRows.length,
        ignoredIncomeCount,
        entries,
    }
}
