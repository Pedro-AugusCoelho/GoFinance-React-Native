export function parseTransactionValue(value: string | number): number | null {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null
    }

    const raw = value.trim().replace(/R\$\s?/i, '')
    if (!raw) return null

    const normalized = raw.includes(',')
        ? raw.replace(/\./g, '').replace(',', '.')
        : raw
    const parsed = Number(normalized)

    return Number.isFinite(parsed) ? parsed : null
}

export function roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100
}
