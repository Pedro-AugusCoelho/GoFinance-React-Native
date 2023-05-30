import React from "react";
import * as H from './styles'

interface HistoryCardProps {
    color: string;
    title: string;
    amount: string;
}

export function HistoryCard ({color, title, amount}: HistoryCardProps) {
    return (
        <H.Container color={color}>
            <H.Title>{title}</H.Title>
            <H.Amount>{amount}</H.Amount>
        </H.Container>
    )
}