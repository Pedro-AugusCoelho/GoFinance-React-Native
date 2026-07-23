import { createTransactionPlan } from './create-transaction-plan'
import { deleteTransactionPlan } from './delete-transaction-plan'
import { editTransactionPlan } from './edit-transaction-plan'
import { TransactionRepository } from '../storage/transaction.repository'
import { TransactionDTO } from '../storage/transaction.dto'

function createRepository(initial: TransactionDTO[] = []) {
    let data = [...initial]
    const repository: TransactionRepository = {
        getAll: jest.fn(async () => data),
        save: jest.fn(async (transactions) => {
            data = transactions
        }),
    }

    return { repository, getData: () => data }
}

describe('transaction use cases', () => {
    it('creates a plan without making the screen coordinate persistence', async () => {
        const { repository, getData } = createRepository()

        await createTransactionPlan({
            name: 'Compra',
            totalValue: 100,
            installments: 2,
            type: 'outcome',
            category: 'purchases',
            date: new Date('2026-01-15T12:00:00.000Z'),
            createId: (() => {
                let id = 0
                return () => `id-${++id}`
            })(),
        }, repository)

        expect(repository.save).toHaveBeenCalledTimes(1)
        expect(getData()).toHaveLength(2)
        expect(getData().every(({ planId }) => planId === 'id-1')).toBe(true)
    })

    it('edits only the current and future installments when requested', async () => {
        const transactions: TransactionDTO[] = [1, 2, 3].map((number) => ({
            id: `id-${number}`,
            name: `Compra - 0${number}/3`,
            value: 10,
            amount: 3,
            type: 'outcome',
            category: 'purchases',
            date: `2026-0${number}-15T12:00:00.000Z`,
            planId: 'plan-1',
            installmentNumber: number,
            installmentTotal: 3,
        }))
        const { repository, getData } = createRepository(transactions)

        await editTransactionPlan({
            id: 'id-2',
            scope: 'future',
            name: 'Compra alterada',
            value: 12.5,
            type: 'outcome',
            category: 'food',
            date: new Date('2026-02-20T12:00:00.000Z'),
        }, repository)

        expect(getData()[0].name).toBe('Compra - 01/3')
        expect(getData()[1].name).toBe('Compra alterada')
        expect(getData()[2].value).toBe(12.5)
    })

    it('deletes all installments when requested', async () => {
        const transactions: TransactionDTO[] = [
            { id: 'id-1', name: 'A', value: 10, amount: 2, type: 'outcome', category: 'food', date: '2026-01-01', planId: 'plan-1', installmentNumber: 1 },
            { id: 'id-2', name: 'B', value: 10, amount: 2, type: 'outcome', category: 'food', date: '2026-02-01', planId: 'plan-1', installmentNumber: 2 },
            { id: 'id-3', name: 'C', value: 5, amount: 1, type: 'income', category: 'salary', date: '2026-01-01' },
        ]
        const { repository, getData } = createRepository(transactions)

        await deleteTransactionPlan('id-1', 'all', repository)

        expect(getData().map(({ id }) => id)).toEqual(['id-3'])
    })
})
