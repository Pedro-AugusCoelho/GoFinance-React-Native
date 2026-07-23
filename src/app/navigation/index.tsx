import React from "react"
import { NavigationContainer } from '@react-navigation/native'

import { useAuth } from "../../modules/user/context/auth"

import { StackRoutes } from "./stack.routes"
import { AuthRoutes } from "./auth.routes"
import { Loading } from "../bootstrap/Loading"

export function MainRoute() {
    const { user, isLoadingUser } = useAuth()

    if (isLoadingUser) {
        return <Loading />
    }

    return(
        <NavigationContainer>
            { user ? <StackRoutes /> : <AuthRoutes /> }
        </NavigationContainer>
    )
}
