import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import * as S from './styles';
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard } from "../../components/TransactionCard";
import { TransactionDataProps } from "../../components/TransactionCard";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from '@react-navigation/native';
import { propsStack } from "../../routes/stack.routes";


export interface DataListProps extends TransactionDataProps {
    id: string;
}

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
    const dataKey = '@gofinances:transactions';
    const navigation: propsStack = useNavigation();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DataListProps[]>([]);
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
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];
        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[]  = transactions.map((item: DataListProps) => {
            if (item.type === 'income') {
                entriesTotal += Number(item.amount)
            } else {
                expensiveTotal += Number(item.amount)
            }

            const amount = Number(item.amount).toLocaleString('pt-BR', {
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
                amount,
                date,
            }
        })
        setData(transactionsFormatted);

        const lastTransactionsEntries = new Date(Math.max.apply(Math, 
            transactions.filter((transaction: DataListProps) => transaction.type === 'income').map((item: DataListProps) => {
                return new Date(item.date).getTime()
            })    
        )).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
        })

        const lastTransactionsExpensives = new Date(Math.max.apply(Math, 
            transactions.filter((transaction: DataListProps) => transaction.type === 'outcome').map((item: DataListProps) => {
                return new Date(item.date).getTime()
            })    
        )).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
        })

        const Interval = `01 a ${lastTransactionsExpensives}`

        setHighlightData({
            entries:{
                total: Number(entriesTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction:'Última entrada dia ' +  String(lastTransactionsEntries)
            },
            expensive:{
                total: Number(expensiveTotal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: 'Última saida dia ' + String(lastTransactionsExpensives)
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

                            <S.LogoutBtn>
                                <S.IconPower name="power" />
                            </S.LogoutBtn>
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