import { filterTransactionsByPeriod } from './transaction-filters'
import { TransactionDTO } from '../storage/transaction.dto'

const transaction = (id: string, date: string): TransactionDTO => ({
    id,
    type: 'outcome',
    name: id,
    value: 10,
    amount: 1,
    category: 'food',
    date,
})

describe('filterTransactionsByPeriod', () => {
    it('filters invalid transaction dates and sorts valid dates descending', () => {
        const result = filterTransactionsByPeriod(
            [
                transaction('old', '2026-01-10'),
                transaction('new', '2026-01-20'),
                transaction('invalid', '2026-02-30'),
            ],
            new Date(2026, 0, 1),
            new Date(2026, 0, 31),
        )

        expect(result.map(({ id }) => id)).toEqual(['new', 'old'])
    })

    it('returns no results for an invalid period', () => {
        expect(filterTransactionsByPeriod(
            [transaction('one', '2026-01-10')],
            new Date('invalid'),
            new Date(2026, 0, 31),
        )).toEqual([])
    })
})
