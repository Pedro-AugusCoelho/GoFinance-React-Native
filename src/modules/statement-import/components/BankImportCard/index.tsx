import React from 'react'
import * as C from './styles'
import { ImportSource } from '../../domain/import-source'
import nubankLogo from '../../../../assets/nubank_logo.png'
import picpayLogo from '../../../../assets/picpay_logo.png'

const bankLogos: Record<ImportSource, number> = {
    nubank: nubankLogo,
    picpay: picpayLogo,
}

interface BankImportCardProps {
    name: string
    subtitle: string
    importSource: ImportSource
    onPress: () => void
}

export function BankImportCard({
    name,
    subtitle,
    importSource,
    onPress,
}: BankImportCardProps) {
    return (
        <C.Container
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Importar do ${name}`}
            accessibilityHint={subtitle}
            testID={`bank-card-${importSource}`}
        >
            <C.Logo>
                <C.LogoImage source={bankLogos[importSource]} resizeMode="cover" />
            </C.Logo>
            <C.Content>
                <C.Name>{name}</C.Name>
                <C.Subtitle>{subtitle}</C.Subtitle>
            </C.Content>
            <C.Chevron name="chevron-right" />
        </C.Container>
    )
}
