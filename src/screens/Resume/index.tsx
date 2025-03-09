import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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


interface ExpensivesData {
    type: 'income' | 'outcome';
    name: string;
    amount: string;
    value: string;
    category: string;
    date: string;
}

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

    function handleDateChange (action: 'next' | 'prev') {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        } else {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }
    
    async function loadData() {
        setIsLoading(true)
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted.filter((expensives: ExpensivesData) => 
            expensives.type === 'outcome' &&
            new Date(expensives.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensives.date).getFullYear() === selectedDate.getFullYear()
        );

        const expensivesTotal = expensives.reduce((acc: number, expensive: ExpensivesData) => {
            return acc + Number(expensive.value)
        },0);

        const totalByCategory: CategoryData[] = []

        categories.forEach(categories => {
            let CategorySum = 0;

            expensives.forEach((expensives: ExpensivesData) => {
                if (expensives.category === categories.key) {
                    CategorySum += Number(expensives.value)
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
                    color: categories.color
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
                            paddingBottom: useBottomTabBarHeight()
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

                        <R.ChartContainer>
                            <VictoryPie 
                                data={totalByCategories}
                                colorScale={totalByCategories.map(item => item.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
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
                    </R.Content>
                </>
                
            }

        </R.Container>
    )
}