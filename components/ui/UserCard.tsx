import { Colors } from '@/constants/Colors'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import { useThemeColor } from '@/hooks/useThemeColor'
import { getAuthInterval, isAuthExpired } from '@/utils'
import { Button } from '@react-navigation/elements'
import React, { FC, use } from 'react'
import { StyleSheet, TouchableHighlight, useColorScheme } from 'react-native'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { IconThemeText } from './IconThemeText'
import { MaterialIcons } from '@expo/vector-icons'

export const UserCard: FC<{
	user: UserBackend
	order: GroupOrderMetaData | undefined
}> = ({ user, order }) => {
    const colorScheme = useColorScheme()
	const styles = StyleSheet.create({
		surface: {
			backgroundColor: useThemeColor({}, 'surface'),
		},
	})

	return (
		<ThemedView
			style={{
				flexDirection: 'row',
				justifyContent: 'flex-start',
				alignItems: 'center',
				padding: 8,
				margin: 8,
				marginBottom: 4,
				borderRadius: 4,
				...styles.surface,
			}}
		>
			<ThemedView style={{ flex: 1, ...styles.surface }}>
				<ThemedText>{user.name}</ThemedText>
				{getTokenExpiryRemainingString(user.authToken)}
			</ThemedView>
			{order && (
				<TouchableHighlight>
					<MaterialIcons name="add" size={24} color={colorScheme === 'dark' ? Colors.dark.action : Colors.light.action} />
				</TouchableHighlight>
			)}
		</ThemedView>
	)
}

function getTokenExpiryRemainingString(authToken: string) {
	if (isAuthExpired(authToken)) {
		return (
			<IconThemeText
				iconName="warning"
				text="Token expired"
				size={14}
				lightColor={Colors.light.warn}
				darkColor={Colors.dark.warn}
			/>
		)
	}
	const date = new Date(getAuthInterval(authToken) * 1000)
	return (
		<IconThemeText
			iconName="timer"
			darkColor={Colors.dark.info}
            lightColor={Colors.light.info}
			text={date.toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})}
		/>
	)
}
