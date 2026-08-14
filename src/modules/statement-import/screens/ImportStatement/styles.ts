import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { RFValue } from 'react-native-responsive-fontsize'
import styled from 'styled-components/native'

export const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(96)}px;
    background-color: ${(props) => props.theme.colors.primary};
    align-items: center;
`

export const Title = styled.Text`
    margin-top: ${getStatusBarHeight() + RFValue(20)}px;
    padding-bottom: 18px;
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.base.white};
`

export const Body = styled.View`
    flex: 1;
    padding: 24px;
`

export const Intro = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 24px;
`

export const LoadingOverlay = styled.View`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.theme.colors.background};
    opacity: 0.85;
`
