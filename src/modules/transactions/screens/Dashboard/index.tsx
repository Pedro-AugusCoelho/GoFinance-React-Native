import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
    Animated,
    ListRenderItemInfo,
    Platform,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useTheme } from 'styled-components/native'

import * as S from './styles'
import { HighlightCard } from '../../../../shared/components/HighlightCard'
import { TransactionCard } from '../../../../shared/components/TransactionCard'
import { AppStackNavigationProp } from '../../../../app/navigation/stack.routes'
import { listTransactions } from '../../application/list-transactions'
import { TransactionDTO } from '../../storage/transaction.dto'
import { useAuth } from '../../../user/context/auth'
import { filterTransactionsByPeriod } from '../../domain/transaction-filters'
import { getErrorMessage } from '../../../../core/errors/app-error'
import { getCurrentDate, parseTransactionDate } from '../../domain/transaction-date'

interface HighlightDataProps {
    total: string
    lastTransaction: string
}

interface HighlightData {
    entries: HighlightDataProps
    expensive: HighlightDataProps
    balance: HighlightDataProps
}

interface TransactionListItem {
    id: string
    type: 'income' | 'outcome'
    name: string
    value: string
    amount: string
    category: string
    date: string
    planId?: string
    installmentNumber?: number
    installmentTotal?: number
    status?: 'pending' | 'paid'
}

const AnimatedTransactionCard = React.memo(function AnimatedTransactionCard({ children, index }: { children: React.ReactNode; index: number }) {
    const opacity = React.useRef(new Animated.Value(0)).current
    const translateY = React.useRef(new Animated.Value(12)).current

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 320,
                delay: Math.min(index * 45, 300),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 320,
                delay: Math.min(index * 45, 300),
                useNativeDriver: true,
            }),
        ]).start()
    }, [index, opacity, translateY])

    return (
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
            {children}
        </Animated.View>
    )
})

export function Dashboard() {
    const navigation: AppStackNavigationProp = useNavigation()
    const theme = useTheme()
    const { user } = useAuth()

    const [startDate, setStartDate] = useState(() => {
        const date = getCurrentDate()
        date.setDate(1)

        return date
    })

    const [endDate, setEndDate] = useState(getCurrentDate())

    const [tempStartDate, setTempStartDate] = useState(() => {
        const date = getCurrentDate()
        date.setDate(1)

        return date
    })

    const [tempEndDate, setTempEndDate] = useState(getCurrentDate())

    const [showDateModal, setShowDateModal] = useState(false)
    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState(false)

    const [periodDirection, setPeriodDirection] = useState<
        'forward' | 'backward'
    >('forward')
    const [selectedQuickPeriod, setSelectedQuickPeriod] = useState<number | null>(null)

    const [isLoading, setIsLoading] = useState(true)

    const [allTransactions, setAllTransactions] = useState<TransactionDTO[]>([])

    const [data, setData] = useState<TransactionListItem[]>([])
    const [visibleLimit, setVisibleLimit] = useState(30)
    const dateRangeOpacity = useRef(new Animated.Value(1)).current

    useEffect(() => {
        Animated.sequence([
            Animated.timing(dateRangeOpacity, {
                toValue: 0.35,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(dateRangeOpacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start()
    }, [startDate, endDate, dateRangeOpacity])

    const [highlightData, setHighlightData] = useState<HighlightData>({
        entries: {
            total: 'R$ 0,00',
            lastTransaction: 'Não possui nenhum lançamento',
        },
        expensive: {
            total: 'R$ 0,00',
            lastTransaction: 'Não possui nenhum lançamento',
        },
        balance: {
            total: 'R$ 0,00',
            lastTransaction: 'Não possui nenhum lançamento',
        },
    })

    function handleEditCard(id: string) {
        navigation.push('Edit', {
            id,
        })
    }

    function handleStartDateChange(_event: DateTimePickerEvent, selectedDate?: Date) {
        setShowStartDatePicker(Platform.OS === 'ios')

        if (selectedDate) {
            setTempStartDate(selectedDate)
            setSelectedQuickPeriod(null)
        }
    }

    function handleEndDateChange(_event: DateTimePickerEvent, selectedDate?: Date) {
        setShowEndDatePicker(Platform.OS === 'ios')

        if (selectedDate) {
            setTempEndDate(selectedDate)
            setSelectedQuickPeriod(null)
        }
    }

    function handleOpenDateModal() {
        setTempStartDate(startDate)
        setTempEndDate(endDate)
        setShowDateModal(true)
    }

    function handleCloseDateModal() {
        setShowDateModal(false)
        setShowStartDatePicker(false)
        setShowEndDatePicker(false)
    }

    function handleApplyDates() {
        if (tempEndDate.getTime() < tempStartDate.getTime()) {
            return
        }

        setStartDate(tempStartDate)
        setEndDate(tempEndDate)
        handleCloseDateModal()
    }

    function handleResetDates() {
        const today = getCurrentDate()

        const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
        )

        setTempStartDate(firstDayOfMonth)
        setTempEndDate(today)
        setSelectedQuickPeriod(null)
    }

    function handleQuickPeriod(months: number) {
        const today = getCurrentDate()
        setSelectedQuickPeriod(months)

        if (periodDirection === 'forward') {
            const start = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
            )

            const end = new Date(
                today.getFullYear(),
                today.getMonth() + months,
                today.getDate(),
            )

            setTempStartDate(start)
            setTempEndDate(end)

            return
        }

        const start = new Date(
            today.getFullYear(),
            today.getMonth() - months,
            today.getDate(),
        )

        const end = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        )

        setTempStartDate(start)
        setTempEndDate(end)
    }

    function getFilteredTransactions(transactions: TransactionDTO[]) {
        /*
         * Considera todo o período selecionado:
         * da primeira hora da data inicial até a última hora da data final.
         */
        const normalizedStartDate = new Date(startDate)
        normalizedStartDate.setHours(0, 0, 0, 0)

        const normalizedEndDate = new Date(endDate)
        normalizedEndDate.setHours(23, 59, 59, 999)

        return transactions
            .filter((transaction) => {
                const transactionDate = parseTransactionDate(transaction.date)

                if (!transactionDate) {
                    return false
                }

                return (
                    transactionDate >= normalizedStartDate &&
                    transactionDate <= normalizedEndDate
                )
            })
            .sort((a, b) => {
                const dateA =
                    parseTransactionDate(a.date)?.getTime() ?? 0

                const dateB =
                    parseTransactionDate(b.date)?.getTime() ?? 0

                return dateB - dateA
            })
    }

    function formatAndSetTransactions(transactions: TransactionDTO[]) {
        let entriesTotal = 0
        let expensiveTotal = 0

        const transactionsFormatted: TransactionListItem[] =
            transactions.map((item: TransactionDTO) => {
                const numericValue =
                    typeof item.value === 'number'
                        ? item.value
                        : 0

                if (item.type === 'income') {
                    entriesTotal += numericValue
                } else {
                    expensiveTotal += numericValue
                }

                const value = (numericValue / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })

                const parsedDate =
                    parseTransactionDate(item.date) ?? getCurrentDate()

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

        setData(transactionsFormatted.slice(0, visibleLimit))

        const incomeTransactions = transactions.filter(
            (transaction) => transaction.type === 'income',
        )

        const outcomeTransactions = transactions.filter(
            (transaction) => transaction.type === 'outcome',
        )

        const incomeDates = incomeTransactions
            .map((item) => parseTransactionDate(item.date))
            .filter((item): item is Date => !!item)

        const outcomeDates = outcomeTransactions
            .map((item) => parseTransactionDate(item.date))
            .filter((item): item is Date => !!item)

        const lastTransactionsEntries =
            incomeDates.length > 0
                ? new Date(
                    Math.max.apply(
                        Math,
                        incomeDates.map((item) => item.getTime()),
                    ),
                ).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                })
                : 'Não possui nenhum lançamento'

        const lastTransactionsExpensives =
            outcomeDates.length > 0
                ? new Date(
                    Math.max.apply(
                        Math,
                        outcomeDates.map((item) => item.getTime()),
                    ),
                ).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                })
                : 'Não possui nenhum lançamento'

        const interval =
            outcomeTransactions.length === 0
                ? 'Não possui nenhum lançamento'
                : `01 a ${lastTransactionsExpensives}`

        setHighlightData({
            entries: {
                total: (entriesTotal / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction:
                    incomeTransactions.length === 0
                        ? 'Não possui nenhum lançamento'
                        : `Última entrada dia ${String(
                            lastTransactionsEntries,
                        )}`,
            },
            expensive: {
                total: (expensiveTotal / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction:
                    outcomeTransactions.length === 0
                        ? 'Não possui nenhum lançamento'
                        : `Última saída dia ${String(
                            lastTransactionsExpensives,
                        )}`,
            },
            balance: {
                total: (Number(
                    entriesTotal - expensiveTotal,
                ) / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: interval,
            },
        })
    }

    async function loadData() {
        try {
            const transactions = await listTransactions()
            setAllTransactions(transactions)
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar as transações.'))
        } finally {
            setIsLoading(false)
        }
    }

    const filteredTransactions = useMemo(() => filterTransactionsByPeriod(
            allTransactions,
            startDate,
            endDate,
        ), [allTransactions, startDate, endDate])

    useEffect(() => {
        setVisibleLimit(30)
    }, [allTransactions, startDate, endDate])

    useEffect(() => {

        formatAndSetTransactions(filteredTransactions)
    }, [filteredTransactions, visibleLimit])

    function handleLoadMore() {
        setVisibleLimit((currentLimit) => currentLimit + 30)
    }

    const hasMoreTransactions = data.length < filteredTransactions.length

    useFocusEffect(
        useCallback(() => {
            loadData()
        }, []),
    )

    if (isLoading) {
        return (
            <S.LoadContainer>
                <ActivityIndicator
                    color={theme.colors.primary}
                    size="large"
                />
            </S.LoadContainer>
        )
    }

    return (
        <S.Container>
            <S.TransactionsList
                data={data}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                windowSize={7}
                removeClippedSubviews={Platform.OS === 'android'}
                ListFooterComponent={hasMoreTransactions ? (
                    <S.LoadMoreButton onPress={handleLoadMore}>
                        <S.LoadMoreText>Carregar mais lançamentos</S.LoadMoreText>
                    </S.LoadMoreButton>
                ) : null}
                keyExtractor={(item: TransactionListItem) =>
                    String(item.id)
                }
                renderItem={({
                    item,
                    index,
                }: ListRenderItemInfo<TransactionListItem>) => (
                    <AnimatedTransactionCard index={index}>
                        <S.TransactionItemWrapper>
                            <TransactionCard
                                data={item}
                                onPress={handleEditCard}
                            />
                        </S.TransactionItemWrapper>
                    </AnimatedTransactionCard>
                )}
                ListHeaderComponent={
                    <S.ListHeader>
                        <S.Header>
                            <S.UserWrapper>
                                <S.UserInfo>
                                    {user!.photo ? (
                                        <S.UserImage
                                            source={{
                                                uri: user!.photo,
                                            }}
                                        />
                                    ) : (
                                        <S.UserAvatarPlaceholder>
                                            <S.UserAvatarText>
                                                {user!.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </S.UserAvatarText>
                                        </S.UserAvatarPlaceholder>
                                    )}

                                    <S.UserWelcome>
                                        <S.WelcomeHello>
                                            Olá,
                                        </S.WelcomeHello>

                                        <S.WelcomeName>
                                            {user!.name.length > 20
                                                ? `${user!.name.slice(
                                                    0,
                                                    20,
                                                )}...`
                                                : user!.name}
                                        </S.WelcomeName>
                                    </S.UserWelcome>
                                </S.UserInfo>
                            </S.UserWrapper>
                        </S.Header>

                        <S.HighlightCards>
                            <HighlightCard
                                color="success"
                                title="Entradas"
                                amount={highlightData.entries.total}
                                lastTransaction={
                                    highlightData.entries
                                        .lastTransaction
                                }
                                type="up"
                            />

                            <HighlightCard
                                color="attention"
                                title="Saídas"
                                amount={highlightData.expensive.total}
                                lastTransaction={
                                    highlightData.expensive
                                        .lastTransaction
                                }
                                type="down"
                            />

                            <HighlightCard
                                color="shape"
                                title="Saldo"
                                amount={highlightData.balance.total}
                                lastTransaction={
                                    highlightData.balance
                                        .lastTransaction
                                }
                                type="total"
                            />
                        </S.HighlightCards>

                        <S.TransactionsHeader>
                            <S.TitleRow>
                                <S.Title>Listagem</S.Title>
                            </S.TitleRow>

                            <S.DateRangeButton
                                onPress={handleOpenDateModal}
                            >
                                <S.DateRangeButtonContent>
                                    <S.DateIcon name="calendar" />

                                    <Animated.View style={{ opacity: dateRangeOpacity }}>
                                        <S.DateRangeButtonText>
                                            {startDate.toLocaleDateString(
                                                'pt-BR',
                                            )}{' '}
                                            -{' '}
                                            {endDate.toLocaleDateString(
                                                'pt-BR',
                                            )}
                                        </S.DateRangeButtonText>
                                    </Animated.View>
                                </S.DateRangeButtonContent>

                                <S.DateIcon name="chevron-down" />
                            </S.DateRangeButton>
                        </S.TransactionsHeader>
                    </S.ListHeader>
                }
            />

            <Modal
                visible={showDateModal}
                transparent
                animationType="slide"
            >
                <S.ModalOverlay>
                    <S.ModalCard>
                        <S.ModalHeader>
                            <S.ModalTitle>
                                Selecionar Período
                            </S.ModalTitle>

                            <S.ModalClose
                                onPress={handleCloseDateModal}
                            >
                                <S.ModalCloseIcon name="x" />
                            </S.ModalClose>
                        </S.ModalHeader>

                        <S.ModalContent>
                            <S.DirectionToggle>
                                <S.DirectionLabel>
                                    Período relativo:
                                </S.DirectionLabel>

                                <S.DirectionButtons>
                                    <S.DirectionButton
                                        active={
                                            periodDirection ===
                                            'backward'
                                        }
                                        onPress={() => {
                                            setPeriodDirection('backward')
                                            setSelectedQuickPeriod(null)
                                        }}
                                    >
                                        <S.DirectionButtonIcon
                                            name="arrow-left"
                                            active={
                                                periodDirection ===
                                                'backward'
                                            }
                                        />

                                        <S.DirectionButtonText
                                            active={
                                                periodDirection ===
                                                'backward'
                                            }
                                        >
                                            Passado
                                        </S.DirectionButtonText>
                                    </S.DirectionButton>

                                    <S.DirectionButton
                                        active={
                                            periodDirection ===
                                            'forward'
                                        }
                                        onPress={() => {
                                            setPeriodDirection('forward')
                                            setSelectedQuickPeriod(null)
                                        }}
                                    >
                                        <S.DirectionButtonIcon
                                            name="arrow-right"
                                            active={
                                                periodDirection ===
                                                'forward'
                                            }
                                        />

                                        <S.DirectionButtonText
                                            active={
                                                periodDirection ===
                                                'forward'
                                            }
                                        >
                                            Futuro
                                        </S.DirectionButtonText>
                                    </S.DirectionButton>
                                </S.DirectionButtons>
                            </S.DirectionToggle>

                            <S.QuickPeriodSection>
                                <S.DateLabel>Atalhos:</S.DateLabel>

                                <S.QuickPeriodButtons>
                                    <S.QuickPeriodButton
                                        active={selectedQuickPeriod === 3}
                                        onPress={() =>
                                            handleQuickPeriod(3)
                                        }
                                    >
                                        <S.QuickPeriodText active={selectedQuickPeriod === 3}>
                                            3 meses
                                        </S.QuickPeriodText>
                                    </S.QuickPeriodButton>

                                    <S.QuickPeriodButton
                                        active={selectedQuickPeriod === 6}
                                        onPress={() =>
                                            handleQuickPeriod(6)
                                        }
                                    >
                                        <S.QuickPeriodText active={selectedQuickPeriod === 6}>
                                            6 meses
                                        </S.QuickPeriodText>
                                    </S.QuickPeriodButton>

                                    <S.QuickPeriodButton
                                        active={selectedQuickPeriod === 9}
                                        onPress={() =>
                                            handleQuickPeriod(9)
                                        }
                                    >
                                        <S.QuickPeriodText active={selectedQuickPeriod === 9}>
                                            9 meses
                                        </S.QuickPeriodText>
                                    </S.QuickPeriodButton>

                                    <S.QuickPeriodButton
                                        active={selectedQuickPeriod === 12}
                                        onPress={() =>
                                            handleQuickPeriod(12)
                                        }
                                    >
                                        <S.QuickPeriodText active={selectedQuickPeriod === 12}>
                                            1 ano
                                        </S.QuickPeriodText>
                                    </S.QuickPeriodButton>
                                </S.QuickPeriodButtons>
                            </S.QuickPeriodSection>

                            <S.DateInputWrapper>
                                <S.DateLabel>
                                    Data inicial:
                                </S.DateLabel>

                                <TouchableOpacity
                                    onPress={() =>
                                        setShowStartDatePicker(true)
                                    }
                                >
                                    <S.DateInput>
                                        <S.DateText>
                                            {tempStartDate.toLocaleDateString(
                                                'pt-BR',
                                            )}
                                        </S.DateText>

                                        <S.DateIcon name="calendar" />
                                    </S.DateInput>
                                </TouchableOpacity>
                            </S.DateInputWrapper>

                            <S.DateInputWrapper>
                                <S.DateLabel>
                                    Data final:
                                </S.DateLabel>

                                <TouchableOpacity
                                    onPress={() =>
                                        setShowEndDatePicker(true)
                                    }
                                >
                                    <S.DateInput>
                                        <S.DateText>
                                            {tempEndDate.toLocaleDateString(
                                                'pt-BR',
                                            )}
                                        </S.DateText>

                                        <S.DateIcon name="calendar" />
                                    </S.DateInput>
                                </TouchableOpacity>
                            </S.DateInputWrapper>

                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={tempStartDate}
                                    mode="date"
                                    display={
                                        Platform.OS === 'android'
                                            ? 'spinner'
                                            : 'default'
                                    }
                                    positiveButton={{
                                        label: 'OK',
                                        textColor:
                                            theme.colors.primary,
                                    }}
                                    negativeButton={{
                                        label: 'Cancelar',
                                        textColor:
                                            theme.colors.primary,
                                    }}
                                    onChange={
                                        handleStartDateChange
                                    }
                                />
                            )}

                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={tempEndDate}
                                    mode="date"
                                    display={
                                        Platform.OS === 'android'
                                            ? 'spinner'
                                            : 'default'
                                    }
                                    positiveButton={{
                                        label: 'OK',
                                        textColor:
                                            theme.colors.primary,
                                    }}
                                    negativeButton={{
                                        label: 'Cancelar',
                                        textColor:
                                            theme.colors.primary,
                                    }}
                                    onChange={handleEndDateChange}
                                />
                            )}

                            <S.ModalButtons>
                                <S.ModalResetButton
                                    onPress={handleResetDates}
                                >
                                    <S.ResetIcon name="refresh-cw" />

                                    <S.ModalButtonText>
                                        Resetar
                                    </S.ModalButtonText>
                                </S.ModalResetButton>

                                <S.ModalApplyButton
                                    disabled={tempEndDate.getTime() < tempStartDate.getTime()}
                                    onPress={handleApplyDates}
                                >
                                    <S.ModalApplyButtonText
                                        disabled={tempEndDate.getTime() < tempStartDate.getTime()}
                                    >
                                        Aplicar
                                    </S.ModalApplyButtonText>
                                </S.ModalApplyButton>
                            </S.ModalButtons>
                        </S.ModalContent>
                    </S.ModalCard>
                </S.ModalOverlay>
            </Modal>
        </S.Container>
    )
}
