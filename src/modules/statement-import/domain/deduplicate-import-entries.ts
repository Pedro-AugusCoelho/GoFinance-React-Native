import { TransactionDTO } from '../../transactions/storage/transaction.dto'
import { StatementEntry } from './statement-entry'

export interface DeduplicatedImport {
    newEntries: StatementEntry[]
    duplicateCount: number
}

function identityKey(source: string, externalId: string): string {
    return `${source}:${externalId}`
}

export function deduplicateImportEntries(
    entries: StatementEntry[],
    existingTransactions: TransactionDTO[],
): DeduplicatedImport {
    const existingKeys = new Set(
        existingTransactions
            .filter((transaction) => transaction.importSource && transaction.externalId)
            .map((transaction) => identityKey(transaction.importSource!, transaction.externalId!)),
    )

    const newEntries: StatementEntry[] = []
    let duplicateCount = 0

    for (const entry of entries) {
        const key = identityKey(entry.importSource, entry.externalId)
        if (existingKeys.has(key)) {
            duplicateCount += 1
            continue
        }

        existingKeys.add(key)
        newEntries.push(entry)
    }

    return { newEntries, duplicateCount }
}
