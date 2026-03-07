import styled, {css} from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";

interface typeProps {
    type: 'up' | 'down' | 'total'
}


export const Container = styled.View<typeProps>`
    width: ${RFValue(260)}px;
    border-radius: 5px;
    padding: 16px 20px;
    margin-right: 16px;
    padding-bottom: ${RFValue(28)}px;
    background-color: ${({type , theme}) => type === 'total' ? theme.colors.secodary : theme.colors.shape }
`;

export const Header = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const Title = styled.Text<typeProps>`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
    color: ${({type , theme}) => type === 'total' ? theme.colors.shape : theme.colors.title };
`;

export const Icon = styled(Feather)<typeProps>`
   font-size: ${RFValue(32)}px;

    ${(props) => props.type === 'up' && css`
        color: ${(props) => props.theme.colors.success} ;
    `};

    ${(props) => props.type === 'down' && css`
        color: ${(props) => props.theme.colors.attention} ;
    `};

    ${(props) => props.type === 'total' && css`
        color: ${(props) => props.theme.colors.shape} ;
    `};
`;

export const Footer = styled.View`
`;

export const Amount = styled.Text<typeProps>`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(28)}px;
    color: ${({type , theme}) => type === 'total' ? theme.colors.shape : theme.colors.title };
    margin-top: 24px;
`;

export const LastTransaction = styled.Text<typeProps>`
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({type , theme}) => type === 'total' ? theme.colors.shape : theme.colors.text };
    font-size: ${RFValue(11)}px;
`;