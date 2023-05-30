import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface styledCard {
    color: string;
}

export const Container = styled.View<styledCard>`
    width: 100%;
    background-color: ${(props) => props.theme.colors.shape};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 14px 24px;
    border-radius: 5px;
    margin-bottom: 8px;

    border-left-width: ${RFValue(6)}px;
    border-left-color: ${({color}) => color};
`;


export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(15)}px;
    color: ${(props) => props.theme.colors.title};
`;