import React, { useMemo } from 'react'
import { TextInputProps } from 'react-native'
import * as C from './styles'

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType'> {
    value?: number | null
    onChangeValue: (value: number) => void
    maxValue?: number
}

function formatCurrency(valueInCents: number): string {
    const normalizedValue = Math.max(0, valueInCents)

    return (normalizedValue / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function CurrencyInput({
    value = 0,
    onChangeValue,
    maxValue,
    ...inputProps
}: CurrencyInputProps) {
    const formattedValue = useMemo(() => {
        return formatCurrency(value ?? 0)
    }, [value])

    function handleChangeText(text: string): void {
        const onlyNumbers = text.replace(/\D/g, '')

        const parsedValue = Number(onlyNumbers || '0')

        if (!Number.isFinite(parsedValue)) {
            onChangeValue(0)
            return
        }

        const normalizedValue =
            typeof maxValue === 'number'
                ? Math.min(parsedValue, maxValue)
                : parsedValue

        onChangeValue(normalizedValue)
    }

    return (
        <C.Container>
            <C.Prefix>R$</C.Prefix>

            <C.Input
                {...inputProps}
                value={formattedValue}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="0,00"
                onChangeText={handleChangeText}
            />
        </C.Container>
    )
}