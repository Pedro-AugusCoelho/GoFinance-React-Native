import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { BottomTabsRoutes } from './app.routes';
import { Edit } from '../../modules/transactions/screens/Edit';

const { Navigator, Screen } = createStackNavigator<AppStackParamList>();

export type AppStackParamList = {
    Home: undefined
    Edit: {
        id: string
    },
}

export type AppStackNavigationProp = StackNavigationProp<AppStackParamList>
export type EditRouteProp = RouteProp<AppStackParamList, 'Edit'>;


export function StackRoutes () {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
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
