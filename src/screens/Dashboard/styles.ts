import styled from "styled-components/native";
import { FlatList, FlatListProps } from "react-native";
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper'
import { BorderlessButton } from 'react-native-gesture-handler';

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.background};
`;
 
export const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(28)}px;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    background-color: ${(props) => props.theme.colors.primary};
`;

export const UserWrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 24px;
    margin-top: ${getStatusBarHeight() + RFValue(20)}px;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const UserImage = styled.Image`
    width: ${RFValue(40)}px;
    height: ${RFValue(40)}px;
    border-radius: 10px;
`;

export const UserAvatarPlaceholder = styled.View`
    width: ${RFValue(40)}px;
    height: ${RFValue(40)}px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.colors.avatar_bg};
    justify-content: center;
    align-items: center;
`;

// @ts-ignore
export const UserAvatarText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.avatar_text};
    text-align: center;
    line-height: ${RFValue(40)}px;
`;

export const UserWelcome = styled.View`
    margin-left: 17px;
`;

export const WelcomeName = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.base.white};
`;

export const WelcomeHello = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.base.white};
`;

// @ts-ignore
export const LogoutBtn = styled(BorderlessButton)``;

// @ts-ignore
export const IconPower = styled(Feather)`
  color: ${({ theme }) => theme.colors.secodary};
  font-size: ${RFValue(24)}px;
`;

export const HighlightCards = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingHorizontal: 24 }
})`
    width:100%;
    position: absolute;
    margin-top: ${RFPercentage(16)}px;
`;

export const Transactions = styled.View`
    flex: 1;
    padding: 0 24px;
    margin-top: ${RFPercentage(16)}px;
    background-color: ${(props) => props.theme.colors.background};
`;

export const TitleRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${RFValue(8)}px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const PeriodLabel = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(12)}px;
    color: ${(props) => props.theme.colors.text};
`;

export const FilterRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${RFValue(12)}px;
`;

export const DirectionButton = styled.TouchableOpacity`
    width: ${RFValue(36)}px;
    height: ${RFValue(36)}px;
    border-radius: 5px;
    border-width: 1px;
    border-color: ${({ theme }) => theme.base.shape_third};
    background-color: ${({ theme }) => theme.base.shape_secondary};
    justify-content: center;
    align-items: center;
    margin-right: ${RFValue(8)}px;
`;

export const DirectionIcon = styled(Feather)`
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.colors.primary};
`;

export const FilterList = styled.ScrollView.attrs({
    contentContainerStyle: {
        alignItems: 'center',
        paddingRight: 24,
        paddingVertical: 4,
    }
})`
    flex: 1;
`;

export const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
    height: ${RFValue(36)}px;
    padding: ${RFValue(8)}px ${RFValue(12)}px;
    border-radius: 5px;
    border-width: 1px;
    border-color: ${({ active, theme }) => active ? theme.colors.primary : theme.base.shape_third};
    background-color: ${({ active, theme }) => active ? theme.base.shape_primary : theme.base.shape_secondary};
    justify-content: center;
    align-items: center;
    margin-right: ${RFValue(8)}px;
`;

export const FilterText = styled.Text<{ active: boolean }>`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(12)}px;
    line-height: ${RFValue(16)}px;
    color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
`;

export const TransactionsList = styled(
    // @ts-ignore
    FlatList as new (props: FlatListProps<TransactionDTO>) => FlatList<TransactionDTO>
    ).attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
        paddingBottom: getBottomSpace() + 24
    }
})``;