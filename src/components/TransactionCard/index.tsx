import React from "react";
import { TouchableOpacityProps } from 'react-native';
import { categories } from "../../../utils/categories";
import * as T from './styles';

export interface TransactionDataProps {
    id?: string;
    type: 'income' | 'outcome';
    name: string;
    value: string;
    amount: string;
    category: string;
    date: string;
    installmentNumber?: number;
    installmentTotal?: number;
}

interface TransactionCardProps {
    data: TransactionDataProps;
    onPress: (id:string) => void;
}

export function TransactionCard({ data, onPress }:TransactionCardProps) {
    const category = categories.filter(item => item.key === data.category)[0]
    const hasInstallment = Boolean(
        data.installmentTotal &&
        data.installmentTotal > 1 &&
        data.installmentNumber
    )
    
    return(
        <T.Container onPress={() => onPress(data.id!)}>
            <T.Header>
                <T.TitleRow>
                    <T.Title numberOfLines={1} ellipsizeMode="tail">{data.name}</T.Title>
                    {hasInstallment && (
                        <T.InstallmentLabel>
                            {`(${data.installmentNumber}/${data.installmentTotal})`}
                        </T.InstallmentLabel>
                    )}
                </T.TitleRow>
                <T.Amount type={data.type}>
                    {data.type === 'outcome' && '- '}
                    {data.value}
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