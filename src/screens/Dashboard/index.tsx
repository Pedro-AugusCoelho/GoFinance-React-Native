import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import * as S from './styles';
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard } from "../../components/TransactionCard";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from '@react-navigation/native';
import { propsStack } from "../../routes/stack.routes";
import { getTransactionsByMonth } from "../../storage/transaction/getTransactionByYearAndMonth";
import { TransactionDTO } from "../../storage/transaction/TransactionStorageDTO";

interface HighlightDataProps {
    total: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightDataProps;
    expensive: HighlightDataProps;
    balance: HighlightDataProps;
}

export function Dashboard() {
    const navigation: propsStack = useNavigation();
    const theme = useTheme();
    const [filterDate, setFilterDate] = useState(['all', 'year', 'month', 'day'])
    const [filterDateSelected, setFilterDateSelected] = useState('month')
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<TransactionDTO[]>([]);
    const [HighlightData , setHighlightData] = useState<HighlightData>({} as HighlightData);

    // async function removeAll() {
    //     await AsyncStorage.removeItem(dataKey);
    // }

    function handleEditCard (id: string) {
        navigation.push('Edit', {
            id
        })
    }

    async function loadData() {
        const transactions = await getTransactionsByMonth()
        let entriesTotal = 0;
        let expensiveTotal = 0;
    
        const transactionsFormatted: TransactionDTO[] = transactions.map((item: TransactionDTO) => {
            if (item.type === 'income') {
                entriesTotal += Number(item.value)
            } else {
                expensiveTotal += Number(item.value)
            }
    
            const value = Number(item.value).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
    
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(item.date))
    
            return {
                id: item.id,
                name: item.name,
                type: item.type,
                category: item.category,
                value,
                amount: item.value,
                date,
            }
        })
    
        setData(transactionsFormatted);
    
        const lastTransactionsEntries = new Date(Math.max.apply(Math, 
            transactions.filter((transaction: TransactionDTO) => transaction.type === 'income').map((item: TransactionDTO) => {
                return new Date(item.date).getTime()
            })    
        )).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
        })
    
        const lastTransactionsExpensives = new Date(Math.max.apply(Math, 
            transactions.filter((transaction: TransactionDTO) => transaction.type === 'outcome').map((item: TransactionDTO) => {
                return new Date(item.date).getTime()
            })    
        )).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
        })
    
        const Interval = lastTransactionsExpensives === 'Invalid Date' ? 'Não possui nenhum lançamento' : `01 a ${lastTransactionsExpensives}`
    
        setHighlightData({
            entries:{
                total: Number(entriesTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionsEntries === 'Invalid Date' ? 'Não possui nenhum lançamento' : `Última entrada dia ${String(lastTransactionsEntries)}`
            },
            expensive:{
                total: Number(expensiveTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionsExpensives === 'Invalid Date' ? 'Não possui nenhum lançamento' : `Última entrada dia ${String(lastTransactionsExpensives)}`
            },
            balance: {
                total: Number(entriesTotal - expensiveTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: Interval
            }
        })
        setIsLoading(false);
    }
    

    useFocusEffect(useCallback(() => {
        loadData();
    },[]))

    useEffect(() => {
        loadData();
    },[]);

    return(
        <S.Container>
            {
                isLoading ? <S.LoadContainer><ActivityIndicator color={theme.colors.primary} size='large' /></S.LoadContainer> :
                <>
                    <S.Header>
                        <S.UserWrapper>
                            <S.UserInfo>
                                <S.UserImage source={{ uri: 'https://github.com/Pedro-AugusCoelho.png'}} />
                                <S.UserWelcome>
                                    <S.WelcomeHello>Olá,</S.WelcomeHello>
                                    <S.WelcomeName>Pedro Augusto C. C.</S.WelcomeName>
                                </S.UserWelcome>
                            </S.UserInfo>

                            {/* <S.LogoutBtn>
                                <S.IconPower name="power" />
                            </S.LogoutBtn> */}
                        </S.UserWrapper>
                    </S.Header>

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

                    <S.Transactions>
                        <S.Title>Listagem</S.Title>

                        <S.TransactionsList
                            data={data}
                            keyExtractor={ item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} onPress={handleEditCard}/>}
                        />
                    </S.Transactions>
                </>
            }
        </S.Container>
    )
}