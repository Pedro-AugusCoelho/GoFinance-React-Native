import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

interface typeProps {
    type: 'income' | 'outcome'
}

export const Container = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.colors.shape};
    padding: 18px 24px;
    margin-bottom: 16px;
`;

export const Header = styled.View``;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const Amount = styled.Text<typeProps>`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(20)}px;
    color: ${({theme, type}) => type === 'income' ? theme.colors.success : theme.colors.attention};
`;

export const Footer = styled.View`
    margin-top: ${RFValue(20)}px;
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