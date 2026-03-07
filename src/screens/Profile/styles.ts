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

export const AvatarPlaceholder = styled.View`
    width: 100%;
    height: 100%;
    border-radius: ${RFValue(99)}px;
    background-color: ${(props) => props.theme.colors.avatar_bg};
    justify-content: center;
    align-items: center;
`;

// @ts-ignore
export const AvatarText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(80)}px;
    color: ${(props) => props.theme.colors.avatar_text};
    text-align: center;
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
    color: ${({ theme }) => theme.base.white};
`;

export const Image = styled.Image`
    width: 100%;
    height: 100%;
    border-radius: ${RFValue(99)}px;
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

export const Error = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.attention};

    margin-bottom: 7px;
`;

export const Section = styled.View`
    margin-top: ${RFValue(24)}px;
`;

export const SectionTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(16)}px;
    color: ${(props) => props.theme.colors.title};
    margin-bottom: ${RFValue(12)}px;
`;

export const ThemeRow = styled.View`
    width: 100%;
    min-height: ${RFValue(56)}px;
    border-radius: 5px;
    padding: 0 ${RFValue(16)}px;
    background-color: ${(props) => props.theme.colors.shape};
    border: 1px solid ${(props) => props.theme.colors.secodary_light};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const ThemeLabel = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.title};
`;

export const Btn = styled.TouchableOpacity`
    width: 100%;
    padding: ${RFValue(16)}px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.primary};
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: ${RFValue(8)}px;
`;

export const BtnSecondary = styled.TouchableOpacity`
    width: 100%;
    padding: ${RFValue(16)}px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.shape};
    border: 1px solid ${(props) => props.theme.colors.primary};
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: ${RFValue(8)}px;
`;

// @ts-ignore
export const BtnIcon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    color: ${({ theme }) => theme.base.white};
    margin-right: ${RFValue(8)}px;
`;

// @ts-ignore
export const BtnIconSecondary = styled(Feather)`
    font-size: ${RFValue(20)}px;
    color: ${(props) => props.theme.colors.primary};
    margin-right: ${RFValue(8)}px;
`;

export const TitleBtn = styled.Text`
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.base.white}; 
`;

export const TitleBtnSecondary = styled.Text`
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.primary}; 
`;