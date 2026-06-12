import styled from 'styled-components/native'
import {
    FlatList,
    FlatListProps,
} from 'react-native'
import {
    RFPercentage,
    RFValue,
} from 'react-native-responsive-fontsize'
import { Feather } from '@expo/vector-icons'
import {
    getStatusBarHeight,
    getBottomSpace,
} from 'react-native-iphone-x-helper'
import { BorderlessButton } from 'react-native-gesture-handler'

interface TransactionListItemProps {
    id: string
    type: 'income' | 'outcome'
    name: string
    value: string
    amount: string
    category: string
    date: string
    planId?: string
    installmentNumber?: number
    installmentTotal?: number
    status?: 'pending' | 'paid'
}

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
        props.theme.colors.background};
`

export const Container = styled.View`
    flex: 1;
    background-color: ${(props) =>
        props.theme.colors.background};
`

/*
 * O FlatList agora ocupa toda a tela.
 * O cabeçalho completo será inserido por ListHeaderComponent.
 */
export const TransactionsList = styled(
    FlatList as new (
        props: FlatListProps<TransactionListItemProps>,
    ) => FlatList<TransactionListItemProps>,
).attrs({
    showsVerticalScrollIndicator: true,
    contentContainerStyle: {
        paddingBottom: getBottomSpace() + 24,
    },
})`
    flex: 1;
`

export const ListHeader = styled.View`
    width: 100%;
    background-color: ${(props) =>
        props.theme.colors.background};
`

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(28)}px;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    background-color: ${(props) =>
        props.theme.colors.primary};
`

export const UserWrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 24px;
    margin-top: ${getStatusBarHeight() + RFValue(20)}px;
`

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
`

export const UserImage = styled.Image`
    width: ${RFValue(40)}px;
    height: ${RFValue(40)}px;
    border-radius: 10px;
`

export const UserAvatarPlaceholder = styled.View`
    width: ${RFValue(40)}px;
    height: ${RFValue(40)}px;
    border-radius: 10px;
    background-color: ${(props) =>
        props.theme.colors.avatar_bg};
    justify-content: center;
    align-items: center;
`

export const UserAvatarText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.avatar_text};
    text-align: center;
    line-height: ${RFValue(40)}px;
`

export const UserWelcome = styled.View`
    margin-left: 17px;
`

export const WelcomeName = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.base.white};
`

export const WelcomeHello = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.base.white};
`

export const LogoutBtn = styled(BorderlessButton)``

export const IconPower = styled(Feather)`
    color: ${({ theme }) => theme.colors.secodary};
    font-size: ${RFValue(24)}px;
`

/*
 * Continua horizontal e sobreposto ao cabeçalho verde.
 */
export const HighlightCards = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {
        paddingHorizontal: 24,
    },
})`
    width: 100%;
    position: absolute;
    margin-top: ${RFPercentage(16)}px;
`

/*
 * Área fixa do cabeçalho da listagem.
 * Os registros começam logo abaixo dela.
 */
export const TransactionsHeader = styled.View`
    width: 100%;
    padding: 0 24px;
    margin-top: ${RFPercentage(16)}px;
    background-color: ${(props) =>
        props.theme.colors.background};
`

export const TransactionItemWrapper = styled.View`
    width: 100%;
    padding: 0 24px;
`

export const TitleRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${RFValue(12)}px;
`

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.title};
`

export const DateRangeButton = styled.TouchableOpacity`
    width: 100%;
    height: ${RFValue(48)}px;
    background-color: ${({ theme }) =>
        theme.base.shape_secondary};
    border: 1px solid ${({ theme }) =>
        theme.base.shape_third};
    border-radius: 8px;
    padding: 0 ${RFValue(16)}px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${RFValue(16)}px;
`

export const DateRangeButtonContent = styled.View`
    flex-direction: row;
    align-items: center;
`

export const DateRangeButtonText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
    margin-left: ${RFValue(8)}px;
`

export const DateIcon = styled(Feather)`
    color: ${(props) => props.theme.colors.title};
    font-size: ${RFValue(20)}px;
`

export const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.45);
    justify-content: flex-end;
`

export const ModalCard = styled.View`
    width: 100%;
    background-color: ${({ theme }) =>
        theme.base.shape_primary};
    border-top-left-radius: ${RFValue(18)}px;
    border-top-right-radius: ${RFValue(18)}px;
    padding: ${RFValue(24)}px;
`

export const ModalHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${RFValue(24)}px;
`

export const ModalTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.colors.title};
`

export const ModalClose = styled.TouchableOpacity`
    width: ${RFValue(32)}px;
    height: ${RFValue(32)}px;
    border-radius: ${RFValue(16)}px;
    align-items: center;
    justify-content: center;
`

export const ModalCloseIcon = styled(Feather)`
    font-size: ${RFValue(24)}px;
    color: ${({ theme }) => theme.colors.text};
`

export const ModalContent = styled.View`
    width: 100%;
`

export const DirectionToggle = styled.View`
    width: 100%;
    margin-bottom: ${RFValue(20)}px;
`

export const DirectionLabel = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: ${RFValue(8)}px;
`

export const DirectionButtons = styled.View`
    flex-direction: row;
    gap: ${RFValue(12)}px;
`

export const DirectionButton = styled.TouchableOpacity<{
    active: boolean
}>`
    flex: 1;
    height: ${RFValue(44)}px;
    background-color: ${({ active, theme }) =>
        active
            ? theme.colors.primary
            : theme.base.shape_secondary};
    border: 1px solid ${({ active, theme }) =>
        active
            ? theme.colors.primary
            : theme.base.shape_third};
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const DirectionButtonIcon = styled(Feather)<{
    active: boolean
}>`
    font-size: ${RFValue(16)}px;
    color: ${({ active, theme }) =>
        active
            ? theme.base.white
            : theme.colors.text};
    margin-right: ${RFValue(6)}px;
`

export const DirectionButtonText = styled.Text<{
    active: boolean
}>`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(13)}px;
    color: ${({ active, theme }) =>
        active
            ? theme.base.white
            : theme.colors.text};
`

export const QuickPeriodSection = styled.View`
    width: 100%;
    margin-bottom: ${RFValue(20)}px;
`

export const QuickPeriodButtons = styled.View`
    flex-direction: row;
    gap: ${RFValue(8)}px;
`

export const QuickPeriodButton = styled.TouchableOpacity`
    flex: 1;
    height: ${RFValue(40)}px;
    background-color: ${({ theme }) =>
        theme.base.shape_secondary};
    border: 1px solid ${({ theme }) =>
        theme.base.shape_third};
    border-radius: 6px;
    align-items: center;
    justify-content: center;
`

export const QuickPeriodText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(12)}px;
    color: ${({ theme }) => theme.colors.title};
`

export const DateInputWrapper = styled.View`
    width: 100%;
    margin-bottom: ${RFValue(16)}px;
`

export const DateLabel = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: ${RFValue(8)}px;
`

export const DateInput = styled.View`
    width: 100%;
    height: ${RFValue(50)}px;
    background-color: ${({ theme }) =>
        theme.base.shape_secondary};
    border: 1px solid ${({ theme }) =>
        theme.base.shape_third};
    border-radius: 5px;
    padding: 0 ${RFValue(16)}px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const DateText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`

export const ModalButtons = styled.View`
    flex-direction: row;
    gap: ${RFValue(12)}px;
    margin-top: ${RFValue(8)}px;
`

export const ModalResetButton = styled.TouchableOpacity`
    flex: 1;
    height: ${RFValue(50)}px;
    background-color: ${({ theme }) =>
        theme.base.shape_secondary};
    border: 1px solid ${({ theme }) =>
        theme.base.shape_third};
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const ModalApplyButton = styled.TouchableOpacity`
    flex: 1;
    height: ${RFValue(50)}px;
    background-color: ${({ theme }) =>
        theme.colors.primary};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
`

export const ModalApplyButtonText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.white};
`

export const ModalButtonText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.colors.title};
`

export const ResetIcon = styled(Feather)`
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.colors.title};
    margin-right: ${RFValue(6)}px;
`