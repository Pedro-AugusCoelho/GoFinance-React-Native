import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.secodary};

    justify-content: center;
    align-items: center;
`;

// @ts-ignore
export const Loading = styled.ActivityIndicator.attrs((props) => ({
    color: props.theme.colors.primary,
    size: 'large'
}))``;