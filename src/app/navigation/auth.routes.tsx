import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { SignIn } from '../../modules/user/screens/SignIn'

const AuthStack = createStackNavigator()

export function AuthRoutes() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={SignIn} />
    </AuthStack.Navigator>
  )
}
