import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import { Appearance } from 'react-native'
import { ThemedText } from '../ThemedText'
import { Colors } from '@/constants/Colors'

export default function RightHeaderThemeButton() {
	return (
		<ThemedText lightColor={Colors.light.action} darkColor={Colors.dark.action}
			onPress={_ =>
				Appearance.setColorScheme(
					Appearance.getColorScheme() === 'light' ? 'dark' : 'light',
				)
			}
		>
			<MaterialIcons
				name={
					Appearance.getColorScheme() === 'light' ? 'light-mode' : 'dark-mode'
				}
			/>
		</ThemedText>
	)
}
