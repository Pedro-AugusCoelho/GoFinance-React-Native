import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.View`
    height: ${RFValue(50)}px;
    padding: 0 ${RFValue(10)}px;
    margin-bottom: ${RFValue(10)}px;
    background-color: ${({ theme }) => theme.base.shape_secondary};
    border: 1px solid ${({ theme }) => theme.base.shape_third};
    border-radius: 5px;

    flex-direction: row;
    align-items: center;
`

export const Prefix = styled.Text`
    margin-right: ${RFValue(5)}px;

    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.title};
`

export const Input = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.base.placeholder,
}))`
    flex: 1;
    height: 100%;
    padding: 0;

    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.title};
`