import React, { useState, useEffect, useCallback } from "react";
import { ListRenderItemInfo } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import * as S from './styles';
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard } from "../../components/TransactionCard";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from '@react-navigation/native';
import { propsStack } from "../../routes/stack.routes";
import { getAllTransactions } from "../../storage/transaction/getAllTransaction";
import { TransactionDTO } from "../../storage/transaction/transactionStorageDTO";
import { useAuth } from "../../hooks/auth";

interface HighlightDataProps {
    total: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightDataProps;
    expensive: HighlightDataProps;
    balance: HighlightDataProps;
}

interface TransactionListItem {
    id: string;
    type: 'income' | 'outcome';
    name: string;
    value: string;
    amount: string;
    category: string;
    date: string;
    planId?: string;
    installmentNumber?: number;
    installmentTotal?: number;
    status?: 'pending' | 'paid';
}

type FilterPeriod = '1m' | '3m' | '6m' | '9m' | '1y'

interface FilterOption {
    key: FilterPeriod;
    label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
    { key: '1m', label: '1 mês' },
    { key: '3m', label: '3 meses' },
    { key: '6m', label: '6 meses' },
    { key: '9m', label: '9 meses' },
    { key: '1y', label: '1 ano' },
]

function parseTransactionValue(value: number | string) {
    const normalized = String(value)
        .replace(/\s/g, '')
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
}

function parseTransactionDate(value: string) {
    const raw = String(value).trim()

    if (raw.includes('T') || raw.includes('-')) {
        const parsed = new Date(raw)
        return Number.isNaN(parsed.getTime()) ? null : parsed
    }

    const brDate = raw.match(/^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/)
    if (brDate) {
        const day = Number(brDate[1])
        const month = Number(brDate[2]) - 1
        const yearRaw = Number(brDate[3])
        const year = brDate[3].length === 2 ? 2000 + yearRaw : yearRaw
        const parsed = new Date(year, month, day)
        return Number.isNaN(parsed.getTime()) ? null : parsed
    }

    const fallback = new Date(raw)
    return Number.isNaN(fallback.getTime()) ? null : fallback
}

export function Dashboard() {
    const navigation: propsStack = useNavigation();
    const theme = useTheme();
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('1m')
    const [filterDirection, setFilterDirection] = useState<'forward' | 'backward'>('forward')
    const [isLoading, setIsLoading] = useState(true);
    const [allTransactions, setAllTransactions] = useState<TransactionDTO[]>([]);
    const [data, setData] = useState<TransactionListItem[]>([]);
    const [HighlightData , setHighlightData] = useState<HighlightData>({} as HighlightData);

    const { user } = useAuth()

    function handleEditCard (id: string) {
        navigation.push('Edit', {
            id
        })
    }

    function getPeriodRange(period: FilterPeriod) {
        const currentDate = new Date()
        const isForward = filterDirection === 'forward'

        if (period === '1m') {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
            return { startDate, endDate }
        }

        if (period === '3m') {
            const startDate = isForward 
                ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                : new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1)
            const endDate = isForward
                ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0, 23, 59, 59, 999)
                : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
            return { startDate, endDate }
        }

        if (period === '6m') {
            const startDate = isForward
                ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                : new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1)
            const endDate = isForward
                ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 0, 23, 59, 59, 999)
                : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
            return { startDate, endDate }
        }

        if (period === '9m') {
            const startDate = isForward
                ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                : new Date(currentDate.getFullYear(), currentDate.getMonth() - 8, 1)
            const endDate = isForward
                ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 9, 0, 23, 59, 59, 999)
                : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
            return { startDate, endDate }
        }

        const startDate = new Date(currentDate.getFullYear(), 0, 1)
        const endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999)
        return { startDate, endDate }
    }

    function formatPeriodLabel() {
        const { startDate, endDate } = getPeriodRange(filterPeriod)
        const startMonth = startDate.toLocaleDateString('pt-BR', { month: 'short' })
        const endMonth = endDate.toLocaleDateString('pt-BR', { month: 'short' })
        const startYear = startDate.getFullYear()
        const endYear = endDate.getFullYear()
        
        if (filterPeriod === '1m') {
            return `${startMonth.charAt(0).toUpperCase() + startMonth.slice(1)}/${String(startYear).slice(2)}`
        }
        
        if (startYear === endYear) {
            return `${startMonth.charAt(0).toUpperCase() + startMonth.slice(1)} - ${endMonth.charAt(0).toUpperCase() + endMonth.slice(1)}/${String(endYear).slice(2)}`
        }
        
        return `${startMonth}/${String(startYear).slice(2)} - ${endMonth}/${String(endYear).slice(2)}`
    }

    function getFilteredTransactions(transactions: TransactionDTO[]) {
        const { startDate, endDate } = getPeriodRange(filterPeriod)

        return transactions
            .filter((transaction) => {
                const transactionDate = parseTransactionDate(transaction.date)
                if (!transactionDate) {
                    return false
                }

                return transactionDate >= startDate && transactionDate <= endDate
            })
            .sort((a, b) => {
                const dateA = parseTransactionDate(a.date)?.getTime() ?? 0
                const dateB = parseTransactionDate(b.date)?.getTime() ?? 0
                return dateB - dateA
            })
    }

    function formatAndSetTransactions(transactions: TransactionDTO[]) {
        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: TransactionListItem[] = transactions.map((item: TransactionDTO) => {
            const numericValue = typeof item.value === 'number' ? item.value : 0

            if (item.type === 'income') {
                entriesTotal += numericValue
            } else {
                expensiveTotal += numericValue
            }

            const value = numericValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })

            const parsedDate = parseTransactionDate(item.date) ?? new Date()

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(parsedDate)

            return {
                id: item.id,
                name: item.name,
                type: item.type,
                category: item.category,
                value,
                amount: String(item.amount),
                date,
                planId: item.planId,
                installmentNumber: item.installmentNumber,
                installmentTotal: item.installmentTotal,
                status: item.status,
            }
        })

        setData(transactionsFormatted)

        const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income')
        const outcomeTransactions = transactions.filter((transaction) => transaction.type === 'outcome')

        const incomeDates = incomeTransactions
            .map((item) => parseTransactionDate(item.date))
            .filter((item): item is Date => !!item)

        const outcomeDates = outcomeTransactions
            .map((item) => parseTransactionDate(item.date))
            .filter((item): item is Date => !!item)

        const lastTransactionsEntries = incomeDates.length > 0
            ? new Date(Math.max.apply(Math, incomeDates.map((item) => item.getTime()))).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
            })
            : 'Não possui nenhum lançamento'

        const lastTransactionsExpensives = outcomeDates.length > 0
            ? new Date(Math.max.apply(Math, outcomeDates.map((item) => item.getTime()))).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
            })
            : 'Não possui nenhum lançamento'

        const interval = outcomeTransactions.length === 0 ? 'Não possui nenhum lançamento' : `01 a ${lastTransactionsExpensives}`

        setHighlightData({
            entries:{
                total: Number(entriesTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: incomeTransactions.length === 0 ? 'Não possui nenhum lançamento' : `Última entrada dia ${String(lastTransactionsEntries)}`
            },
            expensive:{
                total: Number(expensiveTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: outcomeTransactions.length === 0 ? 'Não possui nenhum lançamento' : `Última saída dia ${String(lastTransactionsExpensives)}`
            },
            balance: {
                total: Number(entriesTotal - expensiveTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: interval
            }
        })
    }

    async function loadData() {
        const transactions = await getAllTransactions()
        setAllTransactions(transactions)
        setIsLoading(false);
    }

    useEffect(() => {
        const filteredTransactions = getFilteredTransactions(allTransactions)
        formatAndSetTransactions(filteredTransactions)
    }, [allTransactions, filterPeriod, filterDirection])

    useFocusEffect(useCallback(() => {
        loadData()
    },[]))

    if (isLoading) {
        return(
            <S.LoadContainer>
                {/* @ts-ignore */}
                <ActivityIndicator color={theme.colors.primary} size='large' />
            </S.LoadContainer>
        )
    } else {
        return (
            <S.Container>
                <S.Header>
                    {/* @ts-ignore */}
                    <S.UserWrapper>
                        {/* @ts-ignore */}
                        <S.UserInfo>
                            {user!.photo ? (
                                <S.UserImage source={{ uri: user!.photo }} />
                            ) : (
                                <S.UserAvatarPlaceholder>
                                    {/* @ts-ignore */}
                                    <S.UserAvatarText>
                                        {user!.name.charAt(0).toUpperCase()}
                                    </S.UserAvatarText>
                                </S.UserAvatarPlaceholder>
                            )}
                             {/* @ts-ignore */}
                            <S.UserWelcome>
                                <S.WelcomeHello>Olá,</S.WelcomeHello>
                                <S.WelcomeName>{ user!.name.length > 20 ? user!.name.slice(0, 20) + '...' : user!.name }</S.WelcomeName>
                            </S.UserWelcome>
                        </S.UserInfo>
                    </S.UserWrapper>
                </S.Header>

                {/* @ts-ignore */}
                <S.HighlightCards>
                    <HighlightCard 
                        color={'success'}
                        title='Entradas'
                        amount={HighlightData.entries.total}
                        lastTransaction={HighlightData.entries.lastTransaction}
                        type="up"
                    />

                    <HighlightCard
                        color={'attention'}
                        title='Saídas'
                        amount={HighlightData.expensive.total}
                        lastTransaction={HighlightData.expensive.lastTransaction}
                        type="down"
                    />

                    <HighlightCard 
                        color={'shape'}
                        title='Saldo'
                        amount={HighlightData.balance.total}
                        lastTransaction={HighlightData.balance.lastTransaction}
                        type="total"
                    />
                </S.HighlightCards>

                {/* @ts-ignore */}
                <S.Transactions>
                    <S.TitleRow>
                        <S.Title>Listagem</S.Title>
                        <S.PeriodLabel>{formatPeriodLabel()}</S.PeriodLabel>
                    </S.TitleRow>

                    <S.FilterRow>
                        <S.DirectionButton onPress={() => setFilterDirection(filterDirection === 'forward' ? 'backward' : 'forward')}>
                            <S.DirectionIcon name={filterDirection === 'forward' ? 'arrow-right' : 'arrow-left'} />
                        </S.DirectionButton>

                        <S.FilterList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {FILTER_OPTIONS.map((option) => (
                                <S.FilterButton
                                    key={option.key}
                                    active={filterPeriod === option.key}
                                    onPress={() => setFilterPeriod(option.key)}
                                >
                                    <S.FilterText active={filterPeriod === option.key}>{option.label}</S.FilterText>
                                </S.FilterButton>
                            ))}
                        </S.FilterList>
                    </S.FilterRow>

                    <S.TransactionsList
                        data={data}
                        keyExtractor={(item: TransactionListItem) => String(item.id)}
                        renderItem={({ item }: ListRenderItemInfo<TransactionListItem>) => (
                            <TransactionCard
                                data={item}
                                onPress={handleEditCard}
                            />
                        )}
                    />
                </S.Transactions>
            </S.Container>
        )
    }
}