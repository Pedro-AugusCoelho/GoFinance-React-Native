import React from "react";
import { useTheme } from "styled-components";
import { Alert, Platform, ToastAndroid, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const {Navigator, Screen} = createBottomTabNavigator();

import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";
import { Resume } from "../screens/Resume";
import { Profile } from "../screens/Profile";


export type RootTabParamList = {
    Listagem: undefined
    Cadastrar: { idTransaction: number | null; action: string }
    Resumo: undefined
    perfil: undefined
}

export function BottomTabsRoutes () {
    const theme = useTheme()

    const createTabButton = (tabName: string) => (props: BottomTabBarButtonProps) => (
        <TouchableOpacity
            {...props}
            activeOpacity={0.7}
            delayLongPress={650}
            onLongPress={(event) => {
                props.onLongPress?.(event)

                if (Platform.OS === 'android') {
                    ToastAndroid.show(tabName, ToastAndroid.LONG)
                } else {
                    Alert.alert(tabName)
                }
            }}
        />
    )

    return(
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.product.green_500,
                tabBarInactiveTintColor: theme.base.text,
                tabBarShowLabel: false,
                tabBarStyle:{
                    height: 70,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    backgroundColor: theme.base.shape_primary,
                    borderTopColor: theme.base.shape_third,
                },
            }}
        >
            <Screen
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarButton: createTabButton('Listagem'),
                    tabBarIcon: (({ size, color }) => 
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />

            <Screen
                name="Cadastrar"
                initialParams={{idTransaction: null, action: 'salvar'}}
                component={Register}
                options={{
                    tabBarButton: createTabButton('Cadastrar'),
                    tabBarIcon: (({ size, color }) => 
                        <MaterialIcons
                            name="attach-money"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />

            <Screen
                name="Resumo"
                component={Resume}
                options={{
                    tabBarButton: createTabButton('Resumo'),
                    tabBarIcon: (({ size, color }) => 
                    <MaterialIcons
                        name="pie-chart"
                        size={size}
                        color={color}
                    />
                    )
                }}
            />

            <Screen
                name="Perfil"
                component={Profile}
                options={{
                    tabBarButton: createTabButton('Perfil'),
                    tabBarIcon: (({ size, color }) => 
                    <MaterialIcons
                        name="person"
                        size={size}
                        color={color}
                    />
                    )
                }}
            />
        </Navigator>
    )
}