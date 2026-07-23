function isValidCalendarDate(year: number, month: number, day: number): boolean {
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

function createLocalDate(year: number, month: number, day: number): Date | null {
    return isValidCalendarDate(year, month, day) ? new Date(year, month - 1, day) : null
}

export function serializeTransactionDate(date: Date): string {
    if (Number.isNaN(date.getTime())) {
        throw new AppError('INVALID_TRANSACTION_DATE', 'A data da transação é inválida.')
    }

    // Meio-dia UTC mantém o mesmo dia civil nos fusos suportados pelo app.
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12)).toISOString()
}

export function parseTransactionDate(value: string): Date | null {
    const raw = value.trim()
    const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)

    if (dateOnly) {
        return createLocalDate(Number(dateOnly[1]), Number(dateOnly[2]), Number(dateOnly[3]))
    }

    const brDate = raw.match(/^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/)
    if (brDate) {
        const yearValue = Number(brDate[3])
        const year = brDate[3].length === 2 ? 2000 + yearValue : yearValue
        return createLocalDate(year, Number(brDate[2]), Number(brDate[1]))
    }

    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}
import { AppError } from '../../../core/errors/app-error'
