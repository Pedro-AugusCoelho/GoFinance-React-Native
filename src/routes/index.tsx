import React from "react"
import { NavigationContainer } from '@react-navigation/native'

import { useAuth } from "../hooks/auth"

import { StackRoutes } from "./stack.routes"
import { AuthRoutes } from "./auth.routes"

export function MainRoute() {
    const { user } = useAuth()

    console.log(user)

    return(
        <NavigationContainer>
            { user ? <StackRoutes /> : <AuthRoutes /> }
        </NavigationContainer>
    )
}