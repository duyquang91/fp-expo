import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { Button, HeaderButton, MissingIcon } from '@react-navigation/elements';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RefreshControl } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const headerRight = () => { 
    return (
      <HeaderButton>
        <MaterialIcons.Button name="refresh" backgroundColor="transparent" />
      </HeaderButton>

    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title:'Food Panda Killer', headerShown:true, headerRight:headerRight }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
