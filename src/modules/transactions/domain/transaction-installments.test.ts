import { createInstallmentPlan } from './transaction-installments'

describe('createInstallmentPlan', () => {
    it('distributes cents so the installments preserve the total value', () => {
        const transactions = createInstallmentPlan({
            name: 'Compra',
            totalValue: 100,
            installments: 3,
            type: 'outcome',
            category: 'purchases',
            date: new Date('2026-01-15T12:00:00.000Z'),
            createId: (() => {
                let id = 0
                return () => `id-${++id}`
            })(),
        })

        expect(transactions.map(({ value }) => value)).toEqual([33.34, 33.33, 33.33])
        expect(transactions.reduce((total, { value }) => total + value, 0)).toBe(100)
        expect(transactions.map(({ installmentNumber }) => installmentNumber)).toEqual([1, 2, 3])
    })
})
