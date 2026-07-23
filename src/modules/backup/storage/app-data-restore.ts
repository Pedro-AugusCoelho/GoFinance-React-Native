import { getDatabase } from '../../../core/database/database'
import { AppData } from '../../../core/database/app-data'

export async function restoreAppData(data: AppData) {
    const database = await getDatabase()

    await database.withExclusiveTransactionAsync(async (transaction) => {
        await transaction.runAsync('DELETE FROM users')
        await transaction.runAsync('DELETE FROM settings')
        await transaction.runAsync('DELETE FROM transactions')

        if (data.user) {
            await transaction.runAsync(
                'INSERT INTO users (id, name, photo) VALUES (?, ?, ?)',
                [data.user.id, data.user.name, data.user.photo ?? null],
            )
        }

        await transaction.runAsync(
            'INSERT INTO settings (key, value) VALUES (?, ?)',
            ['theme', data.theme],
        )

        for (const item of data.transactions) {
            await transaction.runAsync(
                `INSERT INTO transactions
                (id, type, name, value, amount, category, date, plan_id,
                 installment_number, installment_total, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    item.id,
                    item.type,
                    item.name,
                    item.value,
                    item.amount,
                    item.category,
                    item.date,
                    item.planId ?? null,
                    item.installmentNumber ?? null,
                    item.installmentTotal ?? null,
                    item.status ?? 'pending',
                ],
            )
        }
    })
}
