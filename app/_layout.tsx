import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import RightHeaderThemeButton from '@/components/ui/RightHeaderThemeButton'
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
						headerRight: () => <RightHeaderThemeButton />,
					}}
				/>
				<Stack.Screen
					name="list"
					options={{
						title: 'Group Order',
						headerBackButtonDisplayMode: 'minimal',
						headerRight: () => <RightHeaderThemeButton />,
					}}
				/>
				<Stack.Screen
					name="test"
					options={{
						title: 'Test component',
						headerBackButtonDisplayMode: 'minimal',
						headerRight: () => <RightHeaderThemeButton />,
					}}
				/>
				<Stack.Screen
					name="+not-found"
					options={{
						title: 'Not Found',
					}}
				/>
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	)
}
