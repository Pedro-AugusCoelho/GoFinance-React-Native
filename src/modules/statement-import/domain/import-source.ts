export const IMPORT_SOURCES = ['nubank', 'picpay'] as const

export type ImportSource = (typeof IMPORT_SOURCES)[number]

export function isImportSource(value: unknown): value is ImportSource {
    return value === 'nubank' || value === 'picpay'
}
