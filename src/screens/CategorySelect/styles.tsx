import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons';

interface CategoryProps {
    isActive: boolean;
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

export const Category = styled.TouchableOpacity<CategoryProps>`
    width: 100%;
    padding: ${RFValue(15)}px;
    flex-direction: row;
    align-items: center;

    background-color: ${({isActive, theme}) => isActive === true ? theme.colors.secodary_light : theme.colors.background };
`;

export const Label = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const Icon = styled(Feather)`
    font-size:${RFValue(20)}px;
    margin-right: 16px;
`;

export const Separator = styled.View`
    height: 1px;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.text};
`;

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;

export const Button = styled.TouchableOpacity`
   width: 100%;
    align-items: center;
    padding: ${RFValue(15)}px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.secodary};
`;

export const FooterTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.shape};
`;