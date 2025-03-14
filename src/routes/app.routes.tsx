import React from "react";
import { useTheme } from "styled-components";
import { Platform } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const {Navigator, Screen} = createBottomTabNavigator();

import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";
import { Resume } from "../screens/Resume";
import { Profile } from "../screens/Profile";
import { TouchableOpacity } from "react-native";


export type RootTabParamList = {
    Listagem: undefined
    Cadastrar: { idTransaction: number | null; action: string }
    Resumo: undefined
    perfil: undefined
}

export function BottomTabsRoutes () {
    const theme = useTheme();

    return(
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.secodary,
                tabBarInactiveTintColor:  theme.colors.text,
                tabBarLabelPosition: 'below-icon',
                tabBarStyle:{
                    height: 70,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0
                },
            }}
        >
            <Screen
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color }) => 
                    <TouchableOpacity>
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    </TouchableOpacity>
                    )
                }}
            />

            <Screen
                name="Cadastrar"
                initialParams={{idTransaction: null, action: 'salvar'}}
                component={Register}
                options={{
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