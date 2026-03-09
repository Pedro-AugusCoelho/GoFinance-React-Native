import { RFValue } from "react-native-responsive-fontsize";
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
    flex-direction: row;
    justify-content: flex-start;
    padding: 0 20px;
    align-items: center;
    width: 100%;
    height: ${RFValue(96)}px;
    background-color: ${(props) => props.theme.colors.primary};
`;

export const GoBack = styled.TouchableOpacity`
    color: ${(props) => props.theme.colors.secodary};
`;

export const IconGoBack = styled(Feather)`
    color: ${({ theme }) => theme.base.white};
    font-size: ${RFValue(24)}px;
`;


export const Title = styled.Text`
    flex: auto;
    text-align: center;
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

export const InstallmentInfo = styled.View`
    width: 100%;
    padding: ${RFValue(10)}px ${RFValue(12)}px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.base.shape_third};
    background-color: ${({ theme }) => theme.base.shape_secondary};
    margin-bottom: ${RFValue(12)}px;
`;

export const InstallmentInfoText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(13)}px;
    color: ${(props) => props.theme.colors.text};
`;

export const Input = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.base.placeholder,
}))`
    height: ${RFValue(55)}px;
    padding: ${RFValue(16)}px;
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
    gap: ${RFValue(10)}px;
`;

export const BtnSelected = styled.TouchableOpacity<typeRegisterSelectedProps>`
    flex: 1;
    min-height: ${RFValue(58)}px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-color: ${({ theme }) => theme.base.shape_third};
    border-width: 1px;
    border-radius: 8px;
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
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const BtnContainer = styled.View`
    flex-direction: column;
`;

export const BtnSubmit = styled.TouchableOpacity`
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: ${RFValue(15)}px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colors.primary};
`;

export const IconBtn = styled(Feather)`
    color: ${({ theme }) => theme.base.white};
    font-size: ${RFValue(20)}px;
`;

export const BtnDelete = styled.TouchableOpacity`
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: ${RFValue(15)}px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colors.attention};
    margin-bottom: ${RFValue(16)}px;
`;

export const TextDelete = styled.Text`
    flex: auto;
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.white};
`;

export const TextSubmit = styled.Text`
    flex: auto;
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.white};
`;

export const Category = styled.TouchableOpacity`
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