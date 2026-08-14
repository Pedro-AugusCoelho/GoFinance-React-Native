import { ImportSource } from './import-source'

export interface StatementEntry {
    importSource: ImportSource
    externalId: string
    name: string
    date: string
    valueCents: number
}

export interface StatementParseResult {
    importSource: ImportSource
    totalRows: number
    ignoredIncomeCount: number
    entries: StatementEntry[]
}
