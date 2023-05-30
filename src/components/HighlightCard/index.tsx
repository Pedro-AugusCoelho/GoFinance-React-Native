import React from "react";
import * as C from './styles'

interface HighlightCardProps {
    title: string;
    amount: string;
    lastTransaction: string;
    type: 'up' | 'down' | 'total'
    color: string;
}

export function HighlightCard (
    {
        color,
        amount,
        lastTransaction,
        title,
        type
    }:HighlightCardProps){

    const icon = {
        up: 'arrow-up-circle',
        down: 'arrow-down-circle',
        total: 'dollar-sign' 
    }

    return (
        <C.Container type={type}>
            <C.Header>
                <C.Title type={type}>{title}</C.Title>
                <C.Icon name={icon[type]} type={type} />
            </C.Header>

            <C.Footer>
                <C.Amount type={type}>{amount}</C.Amount>
                <C.LastTransaction type={type}>{lastTransaction}</C.LastTransaction>
            </C.Footer>
        </C.Container>
    )
}