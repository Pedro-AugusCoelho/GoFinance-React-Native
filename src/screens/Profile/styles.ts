import { RectButton } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons';

export const Container = styled.ScrollView`
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

export const ImageCenter = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-bottom: ${RFValue(20)}px;
`;

export const ImageContainer = styled.View`
    width: ${RFValue(200)}px;
    height: ${RFValue(200)}px;
    border-radius: ${RFValue(200)}px;
    border: ${RFValue(2)}px solid ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.shape};

    justify-content: center;
    align-items: center;
`;

// @ts-ignore
export const SelectImageIcon = styled(RectButton)`
    width: ${RFValue(50)}px;
    height: ${RFValue(50)}px;
    border-radius: ${RFValue(25)}px;
    background-color: ${(props) => props.theme.colors.primary};

    justify-content: center;
    align-items: center;

    z-index: 1;
    position: absolute;
    bottom: ${RFValue(5)}px;
    right: ${RFValue(10)}px;
`;

// @ts-ignore
export const Icon = styled(Feather)`
   font-size: ${RFValue(20)}px;
   color: ${(props) => props.theme.colors.shape};
`;

export const Image = styled.Image`
    width: 100%;
    height: 100%;
    border-radius: ${RFValue(99)}px;
`;

export const Input = styled.TextInput`
    height: ${RFValue(50)}px;
    padding: ${RFValue(10)}px;
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

export const Btn = styled.TouchableOpacity`
    width: 100%;
    padding: ${RFValue(16)}px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.primary};
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: ${RFValue(5)}px;
`;

export const TitleBtn = styled.Text`
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.shape}; 
`;