import { parseTransactionValue, roundCurrency, toAbsoluteCents } from './transaction-money'

describe('transaction money', () => {
    it('accepts Brazilian and plain decimal formats', () => {
        expect(parseTransactionValue('R$ 1.234,56')).toBe(1234.56)
        expect(parseTransactionValue('12.50')).toBe(12.5)
        expect(parseTransactionValue('\u2212R$ 2.110,24')).toBe(-2110.24)
        expect(parseTransactionValue('abc')).toBeNull()
    })

    it('rounds values to cents', () => {
        expect(roundCurrency(10.126)).toBe(10.13)
        expect(toAbsoluteCents(-3000)).toBe(300000)
        expect(toAbsoluteCents(-2110.24)).toBe(211024)
    })
})
