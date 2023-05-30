import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton } from 'react-native-gesture-handler';
import styled, { css } from "styled-components/native";
import { Feather } from '@expo/vector-icons';

interface typeRegisterProps {
    type: 'income' | 'outcome';
}

interface typeRegisterSelectedProps {
    isActive: boolean;
    type: 'income' | 'outcome' | '';
}

export const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(115)}px;
    background-color: ${(props) => props.theme.colors.primary};
    align-items: center;
`;

export const Title = styled.Text`
    margin-top: ${getStatusBarHeight() + RFValue(37)}px;
    padding-bottom: 18px;
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${(props) => props.theme.colors.shape};
`;

export const Body = styled.View`
    flex: 1;
    padding: 24px;
    justify-content: space-between;
`;

export const InputContainer = styled.View`
   width: 100%;
`;

export const Input = styled.TextInput`
    height: ${RFValue(55)}px;
    padding: ${RFValue(16)}px;
    margin-bottom: ${RFValue(10)}px;
    background-color: ${(props) => props.theme.colors.shape};
    border-radius: 5px;

    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.text};
`;

export const BoxBtn = styled.View`
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: 16px;
`;

export const BtnSelected = styled.TouchableOpacity<typeRegisterSelectedProps>`
    width: 48%;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-color: ${(props) => props.theme.colors.text};
    border-width: 1px;
    border-radius: 5px;
    padding: 15px;

   ${({isActive, type, theme}) => isActive && type === 'income' && css`
        background-color: ${theme.colors.success_light};
        border-width: 0px;
   `}

   ${({isActive, type, theme}) => isActive && type === 'outcome' && css`
        background-color: ${theme.colors.attention_light};
        border-width: 0px;
   `}
`;

export const Icon = styled(Feather)<typeRegisterProps>`
    color: ${({theme, type}) => type === 'income' ? theme.colors.success : theme.colors.attention };
    font-size:${RFValue(24)}px;
    margin-right: 14px;
`;

export const TextBtn = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const Footer = styled.View`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const BtnSubmit = styled(RectButton)`
    width: 100%;
    align-items: center;
    padding: ${RFValue(15)}px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.secodary};
`;

export const TextSubmit = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.shape};
`;

export const Category = styled(RectButton)`
    background-color: ${(props) => props.theme.colors.shape};
    width: 100%;
    padding: 18px;
    border-radius: 5px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const CategoryTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const CategoryIcon = styled(Feather)`
    font-size:${RFValue(20)}px;
`;

export const Error = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.attention};

    margin-bottom: 7px;
`;