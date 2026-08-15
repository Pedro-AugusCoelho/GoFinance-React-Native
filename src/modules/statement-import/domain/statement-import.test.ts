import { readFileSync } from 'fs'
import { join } from 'path'
import { parseStatementFile } from '../application/parse-statement-file'
import { importStatementEntries } from '../application/import-statement-entries'
import { detectStatementProvider } from './detect-statement-provider'
import { parseNubankStatement } from './parse-nubank-statement'
// PicPay desabilitado: fatura do cartão só disponível em PDF por enquanto.
// import { parsePicpayStatement } from './parse-picpay-statement'
import { TransactionRepository } from '../../transactions/storage/transaction.repository'
import { TransactionDTO } from '../../transactions/storage/transaction.dto'
import { AppError } from '../../../core/errors/app-error'

const nubankFixture = readFileSync(
    join(__dirname, '../../../../examples_extracts/nubank/NU_379621784_01JUL2026_31JUL2026.csv'),
    'utf8',
)
// const picpayFixture = readFileSync(
//     join(__dirname, '../../../../examples_extracts/picpay/extrato-2026-07-01-2026-07-31.csv'),
//     'utf8',
// )

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

describe('statement import', () => {
    it('detects the provider from the CSV header', () => {
        expect(detectStatementProvider(nubankFixture)).toBe('nubank')
        // expect(detectStatementProvider(picpayFixture)).toBe('picpay')
        expect(() => detectStatementProvider('foo,bar\n1,2')).toThrow(AppError)
    })

    it('imports Nubank invoice rows and keeps import identity', () => {
        const parsed = parseStatementFile(nubankFixture, 'nubank')

        expect(parsed.importSource).toBe('nubank')
        expect(parsed.totalRows).toBe(2)
        expect(parsed.ignoredIncomeCount).toBe(0)
        expect(parsed.entries).toHaveLength(2)
        expect(parsed.entries.every((entry) => entry.importSource === 'nubank')).toBe(true)
        expect(parsed.entries.every((entry) => entry.valueCents > 0)).toBe(true)
        expect(parsed.entries[0].name).toBe('Ec *Runningland - Parcela 1/2')
        expect(parsed.entries[0].valueCents).toBe(14589)
        expect(parsed.entries[1].name).toBe('Mercadolivre*Pontotops - Parcela 12/12')
        expect(parsed.entries[1].valueCents).toBe(6370)
        expect(parsed.entries.every((entry) => Boolean(entry.externalId))).toBe(true)
    })

    it('ignores Nubank invoice credits and refunds', () => {
        const content = [
            'date,title,amount',
            '2026-07-13,Estorno compra,"-50,00"',
            '2026-07-14,Compra válida,"25,00"',
        ].join('\n')

        const parsed = parseNubankStatement(content)

        expect(parsed.totalRows).toBe(2)
        expect(parsed.ignoredIncomeCount).toBe(1)
        expect(parsed.entries).toHaveLength(1)
        expect(parsed.entries[0].name).toBe('Compra válida')
        expect(parsed.entries[0].valueCents).toBe(2500)
    })

    // PicPay desabilitado: fatura do cartão só disponível em PDF por enquanto.
    // it('imports only PicPay outcome rows and converts Brazilian currency', () => {
    //     const parsed = parseStatementFile(picpayFixture, 'picpay')
    //     const largePix = parsed.entries.find((entry) => entry.name.includes('Pix enviado - Pedro Augusto Coelho Costa') && entry.valueCents === 211024)
    //
    //     expect(parsed.importSource).toBe('picpay')
    //     expect(parsed.totalRows).toBe(15)
    //     expect(parsed.ignoredIncomeCount).toBe(9)
    //     expect(parsed.entries).toHaveLength(6)
    //     expect(parsed.entries.every((entry) => entry.importSource === 'picpay')).toBe(true)
    //     expect(parsed.entries.some((entry) => entry.name.toLowerCase().includes('pix recebido'))).toBe(false)
    //     expect(parsed.entries.some((entry) => entry.name.toLowerCase().includes('dinheiro resgatado'))).toBe(false)
    //     expect(largePix).toBeDefined()
    //
    //     const parsedAgain = parsePicpayStatement(picpayFixture)
    //     expect(parsedAgain.entries.find((entry) => entry.valueCents === 3696)?.name).toBe('Compra realizada - 212 Shibata Sao Jose dos Bra')
    // })

    it('does not duplicate rows on a second import of the same file', async () => {
        const { repository, getData } = createRepository()
        const parsed = parseStatementFile(nubankFixture)
        let nextId = 0
        const createId = () => `imported-${++nextId}`

        const first = await importStatementEntries(parsed.entries, createId, repository)
        const second = await importStatementEntries(parsed.entries, createId, repository)

        expect(first.importedCount).toBe(2)
        expect(first.duplicateCount).toBe(0)
        expect(second.importedCount).toBe(0)
        expect(second.duplicateCount).toBe(2)
        expect(getData()).toHaveLength(2)
        expect(getData().every((item) => item.type === 'outcome' && item.status === 'paid' && item.category === 'other')).toBe(true)
        expect(getData().every((item) => item.importSource === 'nubank' && Boolean(item.externalId))).toBe(true)
    })
})
