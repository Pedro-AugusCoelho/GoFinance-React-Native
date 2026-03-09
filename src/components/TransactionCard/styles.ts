import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

interface typeProps {
    type: 'income' | 'outcome'
}

export const Container = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.colors.shape};
    padding: 18px 24px;
    margin-bottom: 16px;
`;

export const Header = styled.View``;

export const TitleRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
    flex: 1;
    margin-right: 8px;
`;

export const InstallmentLabel = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(12)}px;
    color: ${(props) => props.theme.colors.text};
    flex-shrink: 0;
`;

export const Amount = styled.Text<typeProps>`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(20)}px;
    color: ${({theme, type}) => type === 'income' ? theme.colors.success : theme.colors.attention};
    margin-top: ${RFValue(4)}px;
`;

export const Footer = styled.View`
    margin-top: ${RFValue(10)}px;
    flex-direction: row;
    justify-content: space-between;
`;

export const TypeContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    color: ${(props) => props.theme.colors.text};
`;

export const TypeTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.text};
    margin-left: 12px;
`;

export const dateContainer = styled.View`
`;

export const Date = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.text};
`;