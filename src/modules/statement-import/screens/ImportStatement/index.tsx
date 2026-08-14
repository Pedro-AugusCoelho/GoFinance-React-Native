import React, { useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import uuid from 'react-native-uuid'
import { useTheme } from 'styled-components/native'

import * as S from './styles'
import { BankImportCard } from '../../components/BankImportCard'
import { ImportSource } from '../../domain/import-source'
import { pickStatementFile } from '../../storage/pick-statement-file'
import { parseStatementFile } from '../../application/parse-statement-file'
import { importStatementEntries } from '../../application/import-statement-entries'
import { deduplicateImportEntries } from '../../domain/deduplicate-import-entries'
import { asyncTransactionRepository } from '../../../transactions/storage/async-transaction.repository'
import { getErrorMessage } from '../../../../core/errors/app-error'
import { RootTabParamList } from '../../../../app/navigation/app.routes'
import { StatementParseResult } from '../../domain/statement-entry'

const bankProviders = [
    {
        id: 'nubank' as const,
        name: 'Nubank',
        subtitle: 'Importe apenas as saídas do extrato CSV da sua conta.',
        importSource: 'nubank' as ImportSource,
    },
    {
        id: 'picpay' as const,
        name: 'PicPay',
        subtitle: 'Importe apenas as saídas do extrato CSV da sua conta.',
        importSource: 'picpay' as ImportSource,
    },
]

type TabNavigationProps = BottomTabNavigationProp<RootTabParamList>

export function ImportStatement() {
    const [isLoading, setIsLoading] = useState(false)
    const theme = useTheme()
    const navigation = useNavigation<TabNavigationProps>()

    async function confirmAndImport(parsed: StatementParseResult) {
        const currentTransactions = await asyncTransactionRepository.getAll()
        const { newEntries, duplicateCount } = deduplicateImportEntries(parsed.entries, currentTransactions)

        Alert.alert(
            'Confirmar importação',
            `${parsed.totalRows} linhas no arquivo.\n${newEntries.length} saídas novas.\n${parsed.ignoredIncomeCount} entradas ignoradas.\n${duplicateCount} duplicadas.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Importar',
                    onPress: () => {
                        void persistEntries(parsed)
                    },
                },
            ],
        )
    }

    async function persistEntries(parsed: StatementParseResult) {
        setIsLoading(true)
        try {
            const result = await importStatementEntries(parsed.entries, () => String(uuid.v4()))
            Alert.alert(
                'Importação concluída',
                `${result.importedCount} transações importadas, ${parsed.ignoredIncomeCount} ignoradas (entradas), ${result.duplicateCount} duplicadas.`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Listagem'),
                    },
                ],
            )
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível importar o extrato.'))
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSelectBank(source: ImportSource, bankName: string) {
        if (isLoading) {
            return
        }

        setIsLoading(true)
        try {
            const file = await pickStatementFile()
            if (!file) {
                return
            }

            const parsed = parseStatementFile(file.content, source)
            await confirmAndImport(parsed)
        } catch (error: unknown) {
            Alert.alert(
                'Erro',
                getErrorMessage(
                    error,
                    `Este arquivo não parece ser um extrato ${bankName}. Selecione o banco correto ou outro arquivo.`,
                ),
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <S.Container>
            <S.Header>
                <S.Title>Importar extrato</S.Title>
            </S.Header>
            <S.Body>
                <S.Intro>
                    Selecione o banco de origem do arquivo CSV. Apenas saídas serão importadas.
                </S.Intro>
                {bankProviders.map((bank) => (
                    <BankImportCard
                        key={bank.id}
                        name={bank.name}
                        subtitle={bank.subtitle}
                        importSource={bank.importSource}
                        onPress={() => {
                            void handleSelectBank(bank.importSource, bank.name)
                        }}
                    />
                ))}
            </S.Body>
            {isLoading && (
                <S.LoadingOverlay>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </S.LoadingOverlay>
            )}
        </S.Container>
    )
}
