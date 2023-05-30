import React from "react";
import { TouchableOpacityProps } from 'react-native';
import { categories } from "../../../utils/categories";
import { DataListProps } from "../../screens/Dashboard";
import * as T from './styles';

export interface TransactionDataProps {
    id?: string;
    type: 'income' | 'outcome';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface TransactionCardProps {
    data: TransactionDataProps;
    onPress: (id:string) => void;
}

export function TransactionCard({ data, onPress }:TransactionCardProps) {
    const category = categories.filter(item => item.key === data.category)[0]
    
    return(
        <T.Container onPress={() => onPress(data.id!)}>
            <T.Header>
                <T.Title>{data.name}</T.Title>
                <T.Amount type={data.type}>
                    {data.type === 'outcome' && '- '}
                    {data.amount}
                </T.Amount>
            </T.Header>
            
            <T.Footer>
                <T.TypeContainer>
                    <T.Icon name={category.icon} />
                    <T.TypeTitle>{category.name}</T.TypeTitle>
                </T.TypeContainer>
                <T.dateContainer>
                    <T.Date>{data.date}</T.Date>
                </T.dateContainer>
            </T.Footer>
        </T.Container>
    )
}