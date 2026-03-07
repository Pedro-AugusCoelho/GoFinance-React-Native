import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from '@expo/vector-icons';
import styled from "styled-components/native";

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
    height: ${RFValue(96)}px;
    background-color: ${(props) => props.theme.colors.primary};
    align-items: center;
`;

export const Title = styled.Text`
    margin-top: ${getStatusBarHeight() + RFValue(20)}px;
    padding-bottom: 18px;
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.base.white};
`;

export const Content = styled.ScrollView``;

export const ChartContainer = styled.View`
    width: 100%;
    align-items: center;
`;

export const EmptyContainer = styled.View`
    width: 100%;
    min-height: ${RFValue(220)}px;
    justify-content: center;
    align-items: center;
    padding: 0 ${RFValue(12)}px;
`;

export const EmptyText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(16)}px;
    color: ${(props) => props.theme.colors.text};
    text-align: center;
`;

export const MonthSelect = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: ${RFValue(24)}px;
`;

export const MonthSelectBtn = styled.TouchableOpacity``;

export const Icon = styled(Feather)`
    color: ${(props) => props.theme.colors.title};
    font-size: ${RFValue(24)}px;
`;

export const Month = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(20)}px;
    color: ${(props) => props.theme.colors.title};
`;