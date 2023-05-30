import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { BottomTabsRoutes } from './app.routes';
import { Edit } from '../screens/Edit';

const { Navigator, Screen } = createStackNavigator();

export type propsStackNavigation = {
    Home: undefined,
    Listagem: undefined,
    Cadastrar: undefined,
    Resumo: undefined
    Edit: {
        id: string
    },
}

export type propsStack = StackNavigationProp<propsStackNavigation>
export type editRouteProp = RouteProp<propsStackNavigation, 'Edit'>;


export function StackRoutes () {
    return (
        <Navigator
            screenOptions={{
                headerShown: false
            }}
        >   
            <Screen
                name="Home"
                component={BottomTabsRoutes}
            />

            <Screen
                name="Edit"
                component={Edit}
            />
        </Navigator>
    )
}