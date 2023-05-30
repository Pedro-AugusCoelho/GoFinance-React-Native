import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    height: 70%;
    background-color: ${(props) => props.theme.colors.primary};
`;

export const TitleWrapper = styled.View`
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 50px 38px;
`;

export const Title = styled.Text`
    margin-top: 45px;
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(30)}px;
    color: ${(props) => props.theme.colors.shape};
`;

export const ContainerAccessInfo = styled.View`
    margin: 0px 85px;
    margin-bottom: 60px;
    justify-content: center;
    align-items: center;
`;

export const AccessInfo = styled.Text`
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(16)}px;
    color: ${(props) => props.theme.colors.shape}; 
`;

export const Footer = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.secodary};
    align-items: center;
`;

export const Float = styled.View`
    width: 80%;
    margin-top: ${RFValue(-30)}px;
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

export const Error = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.attention};

    margin-bottom: 7px;
`;

export const BtnSignIn = styled.TouchableOpacity`
    width: 100%;
    padding: ${RFValue(16)}px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.primary};
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const TitleSignIn = styled.Text`
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.shape}; 
`;

