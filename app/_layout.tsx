import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { HeaderButton } from '@react-navigation/elements'
import React, { useState } from 'react'

export default function RootLayout() {
  const themeColor = useColorScheme()
	const headerRight = () => {
		return (
			<HeaderButton>
				<MaterialIcons.Button
					name="refresh"
					backgroundColor="transparent"
          color={themeColor === 'dark' ? '#fff' : '#000'}
          onPress={_ => {
            router.setParams({ refresh: Date.now().toString() })
          }}
				/>
			</HeaderButton>
		)
	}

	return (
		<ThemeProvider value={themeColor === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						title: 'Food Panda Killer',
						headerShown: true,
						headerRight: headerRight,
					}}
				/>
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	)
}
