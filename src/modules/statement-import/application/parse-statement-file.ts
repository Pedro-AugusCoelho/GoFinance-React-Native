import { AppError } from '../../../core/errors/app-error'
import { detectStatementProvider } from '../domain/detect-statement-provider'
import { filterOutcomesOnly } from '../domain/filter-outcomes-only'
import { ImportSource } from '../domain/import-source'
import { parseNubankStatement } from '../domain/parse-nubank-statement'
import { parsePicpayStatement } from '../domain/parse-picpay-statement'
import { StatementParseResult } from '../domain/statement-entry'

export function parseStatementFile(
    content: string,
    expectedSource?: ImportSource,
): StatementParseResult {
    const detected = detectStatementProvider(content)

    if (expectedSource && detected !== expectedSource) {
        const bankName = expectedSource === 'nubank' ? 'Nubank' : 'PicPay'
        throw new AppError(
            'STATEMENT_UNSUPPORTED_FORMAT',
            `Este arquivo não parece ser um extrato ${bankName}. Selecione o banco correto ou outro arquivo.`,
        )
    }

    const parsed = detected === 'nubank'
        ? parseNubankStatement(content)
        : parsePicpayStatement(content)

    return {
        ...parsed,
        entries: filterOutcomesOnly(parsed.entries),
    }
}
