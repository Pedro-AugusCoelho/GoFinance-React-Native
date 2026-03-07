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

interface CategoryItemProps {
    isActive: boolean;
}

export const Container = styled.ScrollView`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

export const ScrollView = styled.ScrollView``;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(96)}px;
    background-color: ${(props) => props.theme.colors.primary};
    align-items: center;
`;

export const Title = styled.Text`
    margin-top: ${getStatusBarHeight() + RFValue(20)}px;
    padding-bottom: 18px;
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.base.white};
`;

export const Body = styled.View`
    flex: 1;
    padding: 24px;
    justify-content: space-between;
`;

export const InputContainer = styled.View`
   width: 100%;
`;

export const Input = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.base.placeholder,
}))`
    height: ${RFValue(50)}px;
    padding: ${RFValue(10)}px;
    margin-bottom: ${RFValue(10)}px;
    background-color: ${({ theme }) => theme.base.shape_secondary};
    border: 1px solid ${({ theme }) => theme.base.shape_third};
    border-radius: 5px;

    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.title};
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

// @ts-ignore
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

// @ts-ignore
export const BtnSubmit = styled(RectButton)`
    flex-direction: row;
    width: 100%;
    align-items: center;
    margin-top: ${RFValue(15)}px;
    padding: ${RFValue(15)}px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colors.primary};
`;

export const IconSubmit = styled(Feather)`
    color: ${({ theme }) => theme.base.white};
    font-size: ${RFValue(20)}px;
`;

export const TextSubmit = styled.Text`
    flex: auto;
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.white};
`;

// @ts-ignore
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

// @ts-ignore
export const CategoryIcon = styled(Feather)`
    font-size:${RFValue(20)}px;
`;

export const Error = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.attention};

    margin-bottom: 7px;
`;

export const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.45);
    justify-content: flex-end;
`;

export const ModalCard = styled.View`
    width: 100%;
    max-height: 70%;
    background-color: ${({ theme }) => theme.base.shape_primary};
    border-top-left-radius: ${RFValue(18)}px;
    border-top-right-radius: ${RFValue(18)}px;
    padding: ${RFValue(16)}px;
`;

export const ModalHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${RFValue(12)}px;
`;

export const ModalTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.colors.title};
`;

export const ModalClose = styled.TouchableOpacity`
    width: ${RFValue(32)}px;
    height: ${RFValue(32)}px;
    border-radius: ${RFValue(16)}px;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.base.shape_secondary};
`;

export const ModalCloseIcon = styled(Feather)`
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.colors.title};
`;

export const ModalCategoryItem = styled.TouchableOpacity<CategoryItemProps>`
    width: 100%;
    min-height: ${RFValue(52)}px;
    border-radius: ${RFValue(8)}px;
    padding: 0 ${RFValue(12)}px;
    flex-direction: row;
    align-items: center;
    background-color: ${({ isActive, theme }) =>
        isActive ? theme.base.shape_secondary : theme.base.transparent};
`;

export const ModalCategoryIcon = styled(Feather)`
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.colors.text};
    margin-right: ${RFValue(12)}px;
`;

export const ModalCategoryText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
    color: ${({ theme }) => theme.colors.title};
`;

export const ModalSeparator = styled.View`
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.base.shape_third};
`;