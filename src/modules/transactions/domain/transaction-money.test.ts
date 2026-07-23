import { parseTransactionValue, roundCurrency } from './transaction-money'

describe('transaction money', () => {
    it('accepts Brazilian and plain decimal formats', () => {
        expect(parseTransactionValue('R$ 1.234,56')).toBe(1234.56)
        expect(parseTransactionValue('12.50')).toBe(12.5)
        expect(parseTransactionValue('abc')).toBeNull()
    })

    it('rounds values to cents', () => {
        expect(roundCurrency(10.126)).toBe(10.13)
    })
})
