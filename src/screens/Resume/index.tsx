import React, { useCallback, useState } from "react";

import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from "styled-components";

import * as R from './styles';

import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../../utils/categories";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAllTransactions } from "../../storage/transaction/getAllTransaction";
import { TransactionDTO } from "../../storage/transaction/transactionStorageDTO";


interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {

    const [isLoading, setIsLoading] = useState(false);
    const [ totalByCategories, setTotalByCategories ] = useState<CategoryData[]>([]);
    const [ selectedDate , setSelectedDate ] = useState(new Date);
    const theme = useTheme();
    const bottomTabBarHeight = useBottomTabBarHeight();
    const categoryColorsByKey: Record<string, string> = {
        purchases: theme.product.purple_700,
        food: theme.product.orange_500,
        salary: theme.product.green_500,
        car: theme.product.red_500,
        leisure: theme.product.pink_500,
        studies: theme.product.yellow_500,
        health: theme.product.blue_500,
    };

    function handleDateChange (action: 'next' | 'prev') {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        } else {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }
    
    async function loadData() {
        setIsLoading(true)
        const responseFormatted = await getAllTransactions();

        const expensives = responseFormatted.filter((expensives: TransactionDTO) => 
            expensives.type === 'outcome' &&
            new Date(expensives.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensives.date).getFullYear() === selectedDate.getFullYear()
        );

        const expensivesTotal = expensives.reduce((acc: number, expensive: TransactionDTO) => {
            return acc + expensive.value
        },0);

        const totalByCategory: CategoryData[] = []

        categories.forEach(categories => {
            let CategorySum = 0;

            expensives.forEach((expensives: TransactionDTO) => {
                if (expensives.category === categories.key) {
                    CategorySum += expensives.value
                }
            })

            const percent = `${(CategorySum / expensivesTotal * 100).toFixed(0)}%`;

            if (CategorySum > 0) {
                totalByCategory.push({
                    key: categories.key,
                    name: categories.name,
                    total: CategorySum,
                    totalFormatted: CategorySum.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    percent,
                    color: categoryColorsByKey[categories.key] ?? theme.colors.primary
                })
            }
        })

        setTotalByCategories(totalByCategory)
        setIsLoading(false)
    }

    useFocusEffect(useCallback(() => {
        loadData();
    },[selectedDate]))


    return (
        <R.Container>
            <R.Header>
                <R.Title>Resumo por categoria</R.Title>
            </R.Header>

            {
                isLoading ? <R.LoadContainer><ActivityIndicator color={theme.colors.primary} size='large' /></R.LoadContainer> :
                <>
                    <R.Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: bottomTabBarHeight
                        }}
                    >
                    
                        <R.MonthSelect>
                            <R.MonthSelectBtn onPress={() => handleDateChange('prev')}>
                                <R.Icon name='chevron-left' />
                            </R.MonthSelectBtn>

                            <R.Month>
                                {
                                    format(selectedDate, 'MMMM, yyyy', {locale:ptBR})
                                }
                            </R.Month>

                            <R.MonthSelectBtn onPress={() => handleDateChange('next')}>
                                <R.Icon name='chevron-right' />
                            </R.MonthSelectBtn>
                        </R.MonthSelect>

                        {totalByCategories.length > 0 ? (
                            <>
                                <R.ChartContainer>
                                    <VictoryPie 
                                        data={totalByCategories}
                                        colorScale={totalByCategories.map(item => item.color)}
                                        style={{
                                            labels: {
                                                fontSize: RFValue(18),
                                                fontWeight: 'bold',
                                                fill: theme.base.white
                                            },
                                        }}
                                        labelRadius={50}
                                        x='percent'
                                        y='total'
                                    />
                                </R.ChartContainer>
                                {
                                    totalByCategories.map((item) => (
                                        <HistoryCard key={item.key} color={item.color} title={item.name} amount={item.totalFormatted} />
                                    ))
                                }
                            </>
                        ) : (
                            <R.EmptyContainer>
                                <R.EmptyText>
                                    Não há lançamentos neste mês para gerar o gráfico.
                                </R.EmptyText>
                            </R.EmptyContainer>
                        )}
                    </R.Content>
                </>
                
            }

        </R.Container>
    )
}