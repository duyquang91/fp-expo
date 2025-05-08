import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'

export default function RootLayout() {
	const themeColor = useColorScheme()

	return (
		<ThemeProvider value={themeColor === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						title: 'Food Panda Killer',
					}}
				/>
				<Stack.Screen
					name="list"
					options={{
						title: 'Group Order',
						headerBackButtonDisplayMode: 'minimal',
					}}
				/>
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	)
}
