import React, { useEffect } from 'react';

import 'react-native-gesture-handler';

import { StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainRoute } from './src/routes';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme';
import { ThemeProvider } from 'styled-components';

import { AuthProvider } from './src/hooks/auth';

export default function App() {
  
  const [ fontsLoaded ] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  useEffect(() => {
    async function hideSplashScreen() {
      try {
        // Prevenir que a tela de carregamento seja ocultada automaticamente
        await SplashScreen.preventAutoHideAsync();

        // Ocultar a tela de carregamento
        await SplashScreen.hideAsync();
      } catch (e) {
        console.log(e);
      }
    }

    if (fontsLoaded) {
      hideSplashScreen();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar barStyle={'light-content'} backgroundColor={theme.colors.primary} />
          <AuthProvider>
            <MainRoute />
          </AuthProvider>
        </GestureHandlerRootView>
    </ThemeProvider>
  )
}

