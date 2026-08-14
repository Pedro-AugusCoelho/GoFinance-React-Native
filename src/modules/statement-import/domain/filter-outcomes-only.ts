import { StatementEntry } from './statement-entry'

export function filterOutcomesOnly(entries: StatementEntry[]): StatementEntry[] {
    return entries.filter((entry) => entry.valueCents > 0)
}
