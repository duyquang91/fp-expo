import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { HeaderButton } from '@react-navigation/elements'
import React, { useState } from 'react'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

export default function RootLayout() {
	const [ getColorScheme, setColorScheme] = useState(useColorScheme())
	const headerRight = () => {
		return (
			<HeaderButton>
				<MaterialIcons.Button
					name={getColorScheme === 'dark' ? 'light-mode' : 'dark-mode'}
					backgroundColor="transparent"
          color={getColorScheme === 'dark' ? '#fff' : '#000'}
          onPress={() => {
            setColorScheme(getColorScheme === 'dark' ? 'light' : 'dark')
          }}
				/>
			</HeaderButton>
		)
	}

	return (
		<ThemeProvider value={getColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
