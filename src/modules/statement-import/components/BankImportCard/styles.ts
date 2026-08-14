import styled from 'styled-components/native'
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'

export const Container = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.colors.shape};
    border-radius: 5px;
    padding: 18px 24px;
    margin-bottom: 16px;
    flex-direction: row;
    align-items: center;
`

export const Logo = styled.View`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;
    border-radius: ${RFValue(12)}px;
    overflow: hidden;
`

export const LogoImage = styled.Image`
    width: 100%;
    height: 100%;
`

export const Content = styled.View`
    flex: 1;
    margin-left: 16px;
`

export const Name = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(16)}px;
    color: ${(props) => props.theme.colors.title};
`

export const Subtitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(12)}px;
    color: ${(props) => props.theme.colors.text};
    margin-top: 4px;
`

export const Chevron = styled(Feather)`
    font-size: ${RFValue(20)}px;
    color: ${(props) => props.theme.colors.text};
`
