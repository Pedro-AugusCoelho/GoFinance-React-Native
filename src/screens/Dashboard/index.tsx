import React, { useState, useEffect, useCallback } from "react";
import { ListRenderItemInfo, Platform, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";

import * as S from './styles';
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard } from "../../components/TransactionCard";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";
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
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(1); // Primeiro dia do mês atual
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [tempStartDate, setTempStartDate] = useState(() => {
        const date = new Date();
        date.setDate(1);
        return date;
    });
    const [tempEndDate, setTempEndDate] = useState(new Date());
    const [showDateModal, setShowDateModal] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [periodDirection, setPeriodDirection] = useState<'forward' | 'backward'>('forward');
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

    function handleStartDateChange (event: any, selectedDate?: Date) {
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setTempStartDate(selectedDate);
        }
    }

    function handleEndDateChange (event: any, selectedDate?: Date) {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setTempEndDate(selectedDate);
        }
    }

    function handleOpenDateModal() {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setShowDateModal(true);
    }

    function handleCloseDateModal() {
        setShowDateModal(false);
        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
    }

    function handleApplyDates() {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        handleCloseDateModal();
    }

    function handleResetDates() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setTempStartDate(firstDayOfMonth);
        setTempEndDate(today);
    }

    function handleQuickPeriod(months: number) {
        const today = new Date();
        
        if (periodDirection === 'forward') {
            const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const end = new Date(today.getFullYear(), today.getMonth() + months, today.getDate());
            setTempStartDate(start);
            setTempEndDate(end);
        } else {
            const start = new Date(today.getFullYear(), today.getMonth() - months, today.getDate());
            const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            setTempStartDate(start);
            setTempEndDate(end);
        }
    }

    function formatPeriodLabel() {
        const start = startDate.toLocaleDateString('pt-BR');
        const end = endDate.toLocaleDateString('pt-BR');
        return `${start} - ${end}`;
    }

    function getFilteredTransactions(transactions: TransactionDTO[]) {
        // Normalizar datas para início e fim do dia
        const normalizedStartDate = new Date(startDate);
        normalizedStartDate.setHours(0, 0, 0, 0);
        
        const normalizedEndDate = new Date(endDate);
        normalizedEndDate.setHours(23, 59, 59, 999);

        return transactions
            .filter((transaction) => {
                const transactionDate = parseTransactionDate(transaction.date)
                if (!transactionDate) {
                    return false
                }

                return transactionDate >= normalizedStartDate && transactionDate <= normalizedEndDate
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
    }, [allTransactions, startDate, endDate])

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
                    </S.TitleRow>

                    <S.DateRangeButton onPress={handleOpenDateModal}>
                        <S.DateRangeButtonContent>
                            <S.DateIcon name='calendar' />
                            <S.DateRangeButtonText>
                                {startDate.toLocaleDateString('pt-BR')} - {endDate.toLocaleDateString('pt-BR')}
                            </S.DateRangeButtonText>
                        </S.DateRangeButtonContent>
                        <S.DateIcon name='chevron-down' />
                    </S.DateRangeButton>

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

                <Modal visible={showDateModal} transparent animationType="slide">
                    <S.ModalOverlay>
                        <S.ModalCard>
                            <S.ModalHeader>
                                <S.ModalTitle>Selecionar Período</S.ModalTitle>
                                <S.ModalClose onPress={handleCloseDateModal}>
                                    <S.ModalCloseIcon name="x" />
                                </S.ModalClose>
                            </S.ModalHeader>

                            <S.ModalContent>
                                <S.DirectionToggle>
                                    <S.DirectionLabel>Direção:</S.DirectionLabel>
                                    <S.DirectionButtons>
                                        <S.DirectionButton 
                                            active={periodDirection === 'backward'}
                                            onPress={() => setPeriodDirection('backward')}
                                        >
                                            <S.DirectionButtonIcon name='arrow-left' active={periodDirection === 'backward'} />
                                            <S.DirectionButtonText active={periodDirection === 'backward'}>Passado</S.DirectionButtonText>
                                        </S.DirectionButton>
                                        
                                        <S.DirectionButton 
                                            active={periodDirection === 'forward'}
                                            onPress={() => setPeriodDirection('forward')}
                                        >
                                            <S.DirectionButtonIcon name='arrow-right' active={periodDirection === 'forward'} />
                                            <S.DirectionButtonText active={periodDirection === 'forward'}>Futuro</S.DirectionButtonText>
                                        </S.DirectionButton>
                                    </S.DirectionButtons>
                                </S.DirectionToggle>

                                <S.QuickPeriodSection>
                                    <S.DateLabel>Atalhos:</S.DateLabel>
                                    <S.QuickPeriodButtons>
                                        <S.QuickPeriodButton onPress={() => handleQuickPeriod(3)}>
                                            <S.QuickPeriodText>3 meses</S.QuickPeriodText>
                                        </S.QuickPeriodButton>
                                        
                                        <S.QuickPeriodButton onPress={() => handleQuickPeriod(6)}>
                                            <S.QuickPeriodText>6 meses</S.QuickPeriodText>
                                        </S.QuickPeriodButton>
                                        
                                        <S.QuickPeriodButton onPress={() => handleQuickPeriod(9)}>
                                            <S.QuickPeriodText>9 meses</S.QuickPeriodText>
                                        </S.QuickPeriodButton>
                                        
                                        <S.QuickPeriodButton onPress={() => handleQuickPeriod(12)}>
                                            <S.QuickPeriodText>1 ano</S.QuickPeriodText>
                                        </S.QuickPeriodButton>
                                    </S.QuickPeriodButtons>
                                </S.QuickPeriodSection>

                                <S.DateInputWrapper>
                                    <S.DateLabel>Data inicial:</S.DateLabel>
                                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                                        <S.DateInput>
                                            <S.DateText>{tempStartDate.toLocaleDateString('pt-BR')}</S.DateText>
                                            <S.DateIcon name='calendar' />
                                        </S.DateInput>
                                    </TouchableOpacity>
                                </S.DateInputWrapper>

                                <S.DateInputWrapper>
                                    <S.DateLabel>Data final:</S.DateLabel>
                                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                                        <S.DateInput>
                                            <S.DateText>{tempEndDate.toLocaleDateString('pt-BR')}</S.DateText>
                                            <S.DateIcon name='calendar' />
                                        </S.DateInput>
                                    </TouchableOpacity>
                                </S.DateInputWrapper>

                                {showStartDatePicker && (
                                    <DateTimePicker
                                        value={tempStartDate}
                                        mode="date"
                                        display={Platform.OS === 'android' ? 'spinner' : 'default'}
                                        positiveButton={{ label: 'OK', textColor: theme.colors.primary }}
                                        negativeButton={{ label: 'Cancelar', textColor: theme.colors.primary }}
                                        onChange={handleStartDateChange}
                                    />
                                )}

                                {showEndDatePicker && (
                                    <DateTimePicker
                                        value={tempEndDate}
                                        mode="date"
                                        display={Platform.OS === 'android' ? 'spinner' : 'default'}
                                        positiveButton={{ label: 'OK', textColor: theme.colors.primary }}
                                        negativeButton={{ label: 'Cancelar', textColor: theme.colors.primary }}
                                        onChange={handleEndDateChange}
                                    />
                                )}

                                <S.ModalButtons>
                                    <S.ModalResetButton onPress={handleResetDates}>
                                        <S.ResetIcon name='refresh-cw' />
                                        <S.ModalButtonText>Resetar</S.ModalButtonText>
                                    </S.ModalResetButton>

                                    <S.ModalApplyButton onPress={handleApplyDates}>
                                        <S.ModalApplyButtonText>Aplicar</S.ModalApplyButtonText>
                                    </S.ModalApplyButton>
                                </S.ModalButtons>
                            </S.ModalContent>
                        </S.ModalCard>
                    </S.ModalOverlay>
                </Modal>
            </S.Container>
        )
    }
}