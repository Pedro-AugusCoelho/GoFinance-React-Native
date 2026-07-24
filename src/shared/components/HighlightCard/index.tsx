import React, { memo, useEffect, useState } from "react";
import { Animated } from 'react-native';
import * as C from './styles'

interface HighlightCardProps {
    title: string;
    amount: string;
    lastTransaction: string;
    type: 'up' | 'down' | 'total'
    color: string;
}

export const HighlightCard = memo(function HighlightCard (
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

    const numericAmount = Number(
        amount.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
    ) || 0
    const [displayAmount, setDisplayAmount] = useState('R$ 0,00')

    useEffect(() => {
        const animation = new Animated.Value(0)
        const listener = animation.addListener(({ value }) => {
            setDisplayAmount(value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }))
        })

        Animated.timing(animation, {
            toValue: numericAmount,
            duration: 650,
            useNativeDriver: false,
        }).start()

        return () => {
            animation.removeListener(listener)
            animation.stopAnimation()
        }
    }, [numericAmount])

    return (
        <C.Container type={type}>
            <C.Header>
                <C.Title type={type}>{title}</C.Title>
                <C.Icon name={icon[type]} type={type} />
            </C.Header>

            <C.Footer>
                <C.Amount type={type}>{displayAmount}</C.Amount>
                <C.LastTransaction type={type}>{lastTransaction}</C.LastTransaction>
            </C.Footer>
        </C.Container>
    )
})
