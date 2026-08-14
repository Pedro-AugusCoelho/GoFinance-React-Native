import { AppError } from '../../../core/errors/app-error'
import { parseTransactionDate, serializeTransactionDate } from '../../transactions/domain/transaction-date'
import { parseTransactionValue, toAbsoluteCents } from '../../transactions/domain/transaction-money'
import { normalizeHeader, parseCsv } from './parse-csv'
import { createStableExternalId } from './stable-id'
import { StatementEntry, StatementParseResult } from './statement-entry'

const INCOME_TYPES = new Set(['pix recebido', 'dinheiro resgatado'])

function headerIndex(header: string[], name: string): number {
    return header.indexOf(name)
}

function isIncomeValue(rawValue: string): boolean {
    const normalized = rawValue.replace(/\s/g, '')
    return normalized.includes('+R$') || normalized.startsWith('+')
}

export function parsePicpayStatement(content: string): StatementParseResult {
    const rows = parseCsv(content)
    const header = normalizeHeader(rows[0] ?? [])
    const dateIndex = headerIndex(header, 'data')
    const timeIndex = headerIndex(header, 'hora')
    const typeIndex = headerIndex(header, 'tipo')
    const destinationIndex = headerIndex(header, 'origem / destino')
    const valueIndex = headerIndex(header, 'valor')

    if (dateIndex < 0 || timeIndex < 0 || typeIndex < 0 || destinationIndex < 0 || valueIndex < 0) {
        throw new AppError(
            'STATEMENT_UNSUPPORTED_FORMAT',
            'Este arquivo não parece ser um extrato PicPay.',
        )
    }

    const entries: StatementEntry[] = []
    let ignoredIncomeCount = 0
    const dataRows = rows.slice(1)

    for (const row of dataRows) {
        const rawValue = row[valueIndex] ?? ''
        const type = (row[typeIndex] ?? '').trim()
        const destination = (row[destinationIndex] ?? '').trim()
        const signedValue = parseTransactionValue(rawValue)

        if (INCOME_TYPES.has(type.toLowerCase()) || isIncomeValue(rawValue) || (signedValue !== null && signedValue >= 0)) {
            ignoredIncomeCount += 1
            continue
        }

        if (signedValue === null || signedValue >= 0) {
            throw new AppError('STATEMENT_PARSE_FAILED', 'Não foi possível interpretar o extrato.')
        }

        const date = parseTransactionDate(row[dateIndex] ?? '')
        if (!date || !type || !destination) {
            throw new AppError('STATEMENT_PARSE_FAILED', 'Não foi possível interpretar o extrato.')
        }

        const normalizedValue = String(toAbsoluteCents(signedValue))
        const time = (row[timeIndex] ?? '').trim()

        entries.push({
            importSource: 'picpay',
            externalId: createStableExternalId([row[dateIndex] ?? '', time, type, destination, normalizedValue]),
            name: `${type} - ${destination}`,
            date: serializeTransactionDate(date),
            valueCents: toAbsoluteCents(signedValue),
        })
    }

    return {
        importSource: 'picpay',
        totalRows: dataRows.length,
        ignoredIncomeCount,
        entries,
    }
}
