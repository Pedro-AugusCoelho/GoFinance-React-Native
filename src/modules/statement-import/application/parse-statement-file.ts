import { AppError } from '../../../core/errors/app-error'
import { detectStatementProvider } from '../domain/detect-statement-provider'
import { filterOutcomesOnly } from '../domain/filter-outcomes-only'
import { ImportSource } from '../domain/import-source'
import { parseNubankStatement } from '../domain/parse-nubank-statement'
// PicPay desabilitado: fatura do cartão só disponível em PDF por enquanto.
// import { parsePicpayStatement } from '../domain/parse-picpay-statement'
import { StatementParseResult } from '../domain/statement-entry'

export function parseStatementFile(
    content: string,
    expectedSource?: ImportSource,
): StatementParseResult {
    const detected = detectStatementProvider(content)

    if (expectedSource && detected !== expectedSource) {
        throw new AppError(
            'STATEMENT_UNSUPPORTED_FORMAT',
            'Este arquivo não parece ser uma fatura Nubank. Selecione o banco correto ou outro arquivo.',
        )
    }

    const parsed = parseNubankStatement(content)
    // PicPay desabilitado: fatura do cartão só disponível em PDF por enquanto.
    // const parsed = detected === 'nubank'
    //     ? parseNubankStatement(content)
    //     : parsePicpayStatement(content)

    return {
        ...parsed,
        entries: filterOutcomesOnly(parsed.entries),
    }
}
