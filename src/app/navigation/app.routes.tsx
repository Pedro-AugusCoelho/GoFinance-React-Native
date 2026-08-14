import React, { useEffect, useRef } from "react";
import { useTheme } from "styled-components";
import { Alert, Animated, Platform, ToastAndroid, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const {Navigator, Screen} = createBottomTabNavigator<RootTabParamList>();

interface TabIconProps {
    name: React.ComponentProps<typeof MaterialIcons>['name']
    size: number
    color: string
    focused: boolean
}

function TabIcon({ name, size, color, focused }: TabIconProps) {
    const scale = useRef(new Animated.Value(focused ? 1.12 : 1)).current

    useEffect(() => {
        const animation = Animated.spring(scale, {
            toValue: focused ? 1.12 : 1,
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
        })

        animation.start()

        return () => {
            animation.stop()
        }
    }, [focused, scale])

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <MaterialIcons
                name={name}
                size={size}
                color={color}
            />
        </Animated.View>
    )
}

import { Dashboard } from "../../modules/transactions/screens/Dashboard";
import { Register } from "../../modules/transactions/screens/Register";
import { ImportStatement } from "../../modules/statement-import/screens/ImportStatement";
import { Resume } from "../../modules/reports/screens/Resume";
import { Profile } from "../../modules/user/screens/Profile";


export type RootTabParamList = {
    Listagem: undefined
    Cadastrar: undefined
    Importar: undefined
    Resumo: undefined
    Perfil: undefined
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
                    tabBarIcon: (({ size, color, focused }) =>
                        <TabIcon
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                            focused={focused}
                        />
                    )
                }}
            />

            <Screen
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarButton: createTabButton('Cadastrar'),
                    tabBarIcon: (({ size, color, focused }) =>
                        <TabIcon
                            name="attach-money"
                            size={size}
                            color={color}
                            focused={focused}
                        />
                    )
                }}
            />

            <Screen
                name="Importar"
                component={ImportStatement}
                options={{
                    tabBarButton: createTabButton('Importar extrato'),
                    tabBarIcon: (({ size, color, focused }) =>
                        <TabIcon
                            name="upload-file"
                            size={size}
                            color={color}
                            focused={focused}
                        />
                    )
                }}
            />

            <Screen
                name="Resumo"
                component={Resume}
                options={{
                    tabBarButton: createTabButton('Resumo'),
                    tabBarIcon: (({ size, color, focused }) =>
                    <TabIcon
                        name="pie-chart"
                        size={size}
                        color={color}
                        focused={focused}
                    />
                    )
                }}
            />

            <Screen
                name="Perfil"
                component={Profile}
                options={{
                    tabBarButton: createTabButton('Perfil'),
                    tabBarIcon: (({ size, color, focused }) =>
                    <TabIcon
                        name="person"
                        size={size}
                        color={color}
                        focused={focused}
                    />
                    )
                }}
            />
        </Navigator>
    )
}
