import { parseTransactionDate, serializeTransactionDate } from './transaction-date'

describe('transaction dates', () => {
    it('rejects impossible calendar dates instead of normalizing them', () => {
        expect(parseTransactionDate('31/02/2026')).toBeNull()
        expect(parseTransactionDate('2026-02-30')).toBeNull()
    })

    it('preserves the civil day when serializing a local date', () => {
        const date = new Date(2026, 0, 15, 23, 30)
        const serialized = serializeTransactionDate(date)

        expect(parseTransactionDate(serialized)?.getUTCDate()).toBe(15)
    })
})
