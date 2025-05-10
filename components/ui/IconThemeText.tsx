import { MaterialIcons as MaterialIconsType } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { FC } from 'react'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { TextProps, TextStyle, useColorScheme } from 'react-native'

export const IconThemeText: FC<{
	iconName: keyof typeof MaterialIconsType.glyphMap
	text: string
	size?: number
	lightColor?: string
	darkColor?: string
	styles?: TextStyle
}> = ({ iconName, text, size, lightColor, darkColor, styles }) => {
	return (
		<ThemedView darkColor='transparent' lightColor='transparent' style={{ flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center' }}>
			<MaterialIcons style={{ color: useColorScheme() === 'dark' ? darkColor : lightColor, paddingRight: 2 }} name={iconName} size={size}/>
			<ThemedText numberOfLines={1} lightColor={lightColor} darkColor={darkColor} style={{ fontSize: size, paddingRight: 8 }}>{text}</ThemedText>
		</ThemedView>
	)
}
