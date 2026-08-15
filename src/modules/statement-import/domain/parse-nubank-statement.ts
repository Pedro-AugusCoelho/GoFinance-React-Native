import { AppError } from '../../../core/errors/app-error'
import { parseTransactionDate, serializeTransactionDate } from '../../transactions/domain/transaction-date'
import { parseTransactionValue, toAbsoluteCents } from '../../transactions/domain/transaction-money'
import { normalizeHeader, parseCsv } from './parse-csv'
import { createStableExternalId } from './stable-id'
import { StatementEntry, StatementParseResult } from './statement-entry'

function headerIndex(header: string[], name: string): number {
    return header.indexOf(name)
}

export function parseNubankStatement(content: string): StatementParseResult {
    const rows = parseCsv(content)
    const header = normalizeHeader(rows[0] ?? [])
    const dateIndex = headerIndex(header, 'date')
    const titleIndex = headerIndex(header, 'title')
    const amountIndex = headerIndex(header, 'amount')

    if (dateIndex < 0 || titleIndex < 0 || amountIndex < 0) {
        throw new AppError(
            'STATEMENT_UNSUPPORTED_FORMAT',
            'Este arquivo não parece ser uma fatura Nubank.',
        )
    }

    const entries: StatementEntry[] = []
    let ignoredIncomeCount = 0
    const dataRows = rows.slice(1)

    for (const row of dataRows) {
        const signedValue = parseTransactionValue(row[amountIndex] ?? '')
        if (signedValue === null) {
            throw new AppError('STATEMENT_PARSE_FAILED', 'Não foi possível interpretar a fatura.')
        }

        if (signedValue <= 0) {
            ignoredIncomeCount += 1
            continue
        }

        const date = parseTransactionDate(row[dateIndex] ?? '')
        const name = (row[titleIndex] ?? '').trim()

        if (!date || !name) {
            throw new AppError('STATEMENT_PARSE_FAILED', 'Não foi possível interpretar a fatura.')
        }

        const valueCents = toAbsoluteCents(signedValue)

        entries.push({
            importSource: 'nubank',
            externalId: createStableExternalId([row[dateIndex] ?? '', name, String(valueCents)]),
            name,
            date: serializeTransactionDate(date),
            valueCents,
        })
    }

    return {
        importSource: 'nubank',
        totalRows: dataRows.length,
        ignoredIncomeCount,
        entries,
    }
}
