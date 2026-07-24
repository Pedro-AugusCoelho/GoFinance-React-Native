import React, { useCallback, useState } from "react";

import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from "styled-components/native";

import * as R from './styles';

import { categories } from "../../../transactions/domain/categories";
import { ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { listTransactions } from "../../../transactions/application/list-transactions";
import { TransactionDTO } from "../../../transactions/storage/transaction.dto";
import { getErrorMessage } from '../../../../core/errors/app-error'
import { getCurrentDate } from '../../../transactions/domain/transaction-date'


interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
    percentage: number;
    icon: string;
}

export function Resume() {

    const [isLoading, setIsLoading] = useState(false);
    const [ totalByCategories, setTotalByCategories ] = useState<CategoryData[]>([]);
    const [ totalExpenses, setTotalExpenses ] = useState(0);
    const [ selectedDate , setSelectedDate ] = useState(getCurrentDate);
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
        try {
        const responseFormatted = await listTransactions();

        const expensives = responseFormatted.filter((expensives: TransactionDTO) => 
            expensives.type === 'outcome' &&
            new Date(expensives.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensives.date).getFullYear() === selectedDate.getFullYear()
        );

        const expensivesTotal = expensives.reduce((acc: number, expensive: TransactionDTO) => {
            return acc + expensive.value
        },0);

        const totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let CategorySum = 0;

            expensives.forEach((expensives: TransactionDTO) => {
                if (expensives.category === category.key) {
                    CategorySum += expensives.value
                }
            })

            const percentage = expensivesTotal > 0
                ? CategorySum / expensivesTotal * 100
                : 0
            const percent = `${percentage.toFixed(0)}%`;

            if (CategorySum > 0) {
                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: CategorySum,
                    totalFormatted: (CategorySum / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    percent,
                    percentage,
                    icon: category.icon,
                    color: categoryColorsByKey[category.key] ?? category.color ?? theme.colors.primary
                })
            }
        })

        setTotalExpenses(expensivesTotal)
        setTotalByCategories(totalByCategory.sort((a, b) => b.total - a.total))
        } catch (error: unknown) {
            setTotalByCategories([])
            setTotalExpenses(0)
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar o resumo.'))
        } finally {
            setIsLoading(false)
        }
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
                                        labels={() => ''}
                                        style={{
                                            labels: {
                                                fontSize: RFValue(18),
                                                fontWeight: 'bold',
                                                fill: theme.base.white
                                            },
                                        }}
                                        labelRadius={50}
                                        innerRadius={55}
                                        x='percent'
                                        y='total'
                                    />
                                </R.ChartContainer>

                                <R.SectionHeader>
                                    <R.SectionTitle>Gastos por categoria</R.SectionTitle>
                                    <R.SectionTotal>
                                        { (totalExpenses / 100).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }) }
                                    </R.SectionTotal>
                                </R.SectionHeader>
                                {totalByCategories.map((item) => (
                                    <R.CategoryRow key={item.key}>
                                        <R.CategoryHeader>
                                            <R.CategoryInfo>
                                                <R.CategoryIcon
                                                    name={item.icon as React.ComponentProps<typeof R.CategoryIcon>['name']}
                                                />
                                                <R.CategoryName>{item.name}</R.CategoryName>
                                            </R.CategoryInfo>
                                            <R.CategoryAmount>{item.totalFormatted}</R.CategoryAmount>
                                        </R.CategoryHeader>
                                        <R.ProgressTrack>
                                            <R.ProgressFill color={item.color} widthPercent={item.percentage} />
                                        </R.ProgressTrack>
                                        <R.CategoryPercent>{item.percent} do total</R.CategoryPercent>
                                    </R.CategoryRow>
                                ))}
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
