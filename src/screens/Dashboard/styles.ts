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
`;
 
export const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(42)}px;
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
    margin-top: ${getStatusBarHeight() + RFValue(28)}px;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const UserImage = styled.Image`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;
    border-radius: 10px;
`;

export const UserWelcome = styled.View`
    margin-left: 17px;
`;

export const WelcomeName = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.shape};
`;

export const WelcomeHello = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.shape};
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
    margin-top: ${RFPercentage(20)}px;
`;

export const Transactions = styled.View`
    flex: 1;
    padding: 0 24px;
    margin-top: ${RFPercentage(12)}px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.title};
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