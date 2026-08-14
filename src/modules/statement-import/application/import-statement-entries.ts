import { TransactionRepository } from '../../transactions/storage/transaction.repository'
import { TransactionDTO } from '../../transactions/storage/transaction.dto'
import { deduplicateImportEntries } from '../domain/deduplicate-import-entries'
import { StatementEntry } from '../domain/statement-entry'
import { asyncTransactionRepository } from '../../transactions/storage/async-transaction.repository'
import { toAppError } from '../../../core/errors/app-error'

export interface ImportStatementResult {
    importedCount: number
    duplicateCount: number
}

function toTransaction(entry: StatementEntry, createId: () => string): TransactionDTO {
    return {
        id: createId(),
        type: 'outcome',
        name: entry.name,
        value: entry.valueCents,
        amount: 1,
        category: 'other',
        date: entry.date,
        status: 'paid',
        importSource: entry.importSource,
        externalId: entry.externalId,
    }
}

export async function importStatementEntries(
    entries: StatementEntry[],
    createId: () => string,
    repository: TransactionRepository = asyncTransactionRepository,
): Promise<ImportStatementResult> {
    try {
        const currentTransactions = await repository.getAll()
        const { newEntries, duplicateCount } = deduplicateImportEntries(entries, currentTransactions)
        const imported = newEntries.map((entry) => toTransaction(entry, createId))

        await repository.save([...currentTransactions, ...imported])

        return {
            importedCount: imported.length,
            duplicateCount,
        }
    } catch (error: unknown) {
        throw toAppError(error, 'STATEMENT_IMPORT_FAILED', 'Não foi possível importar o extrato.')
    }
}
