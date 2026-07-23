import { createBackupDocument, parseBackupDocument } from './backup-format'

const data = {
    user: { id: 'user-1', name: 'Pedro' },
    theme: 'dark' as const,
    transactions: [],
}

describe('backup format', () => {
    it('creates a versioned document with only application data and checksum', async () => {
        const document = await createBackupDocument(data)

        expect(document.format).toBe('gofinance-backup')
        expect(document.version).toBe(1)
        expect(document.checksum).toBeTruthy()
        expect(document.data).toEqual(data)
        expect(document).not.toHaveProperty('arbitraryStorageKey')
    })

    it('rejects unknown, incompatible or corrupted backup documents', async () => {
        await expect(parseBackupDocument({})).rejects.toThrow('BACKUP_INVALID')
        await expect(parseBackupDocument({
            format: 'gofinance-backup',
            version: 99,
            exportedAt: new Date().toISOString(),
            checksum: 'checksum',
            data,
        })).rejects.toThrow('BACKUP_INVALID')

        const document = await createBackupDocument(data)
        await expect(parseBackupDocument({ ...document, data: { ...data, theme: 'light' } }))
            .rejects.toThrow('BACKUP_CHECKSUM_INVALID')
    })
})
