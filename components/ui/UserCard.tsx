import { Colors } from '@/constants/Colors'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import { useThemeColor } from '@/hooks/useThemeColor'
import { getAuthInterval, isAuthExpired } from '@/utils'
import { MaterialIcons } from '@expo/vector-icons'
import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { IconThemeText } from './IconThemeText'

export const UserCard: FC<{
	user: UserBackend
	order: GroupOrderMetaData | undefined
	onPress?: (user: UserBackend) => void
}> = ({ user, order, onPress }) => {
	const [selected, setSelected] = React.useState(false)
	const colorScheme = useColorScheme()
	const styles = StyleSheet.create({
		surface: {
			backgroundColor: useThemeColor({}, 'surface'),
		},
	})
	const disabled = !order || isAuthExpired(user.authToken) || user.allowance === 0

	return (
		<TouchableOpacity
			disabled={disabled}
			onPress={() => {
				setSelected(!selected)
				onPress?.(user)
			}}
		>
			<ThemedView
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
					padding: 8,
					margin: 16,
					marginBottom: -8,
					borderRadius: 4,
					...styles.surface,
				}}
			>
				<ThemedView style={{ flex: 1, ...styles.surface }}>
					<ThemedText>{user.name}</ThemedText>
					{getTokenExpiryRemainingString(user)}
				</ThemedView>
				{!disabled && (
					<MaterialIcons
						name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
						size={16}
						color={
							colorScheme === 'dark' ? Colors.dark.action : Colors.light.action
						}
					/>
				)}
			</ThemedView>
		</TouchableOpacity>
	)
}

function getTokenExpiryRemainingString(user: UserBackend) {
	if (isAuthExpired(user.authToken)) {
		return (
			<IconThemeText
				iconName="warning"
				text="Token expired"
				size={13}
				lightColor={Colors.light.warn}
				darkColor={Colors.dark.warn}
			/>
		)
	}
	const date = new Date(getAuthInterval(user.authToken) * 1000)
	const tokenExp = date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
	return (
		<ThemedText
			darkColor={Colors.dark.info}
			lightColor={Colors.light.info}
			style={{ fontSize: 13 }}
		>
			{`$${user.allowance ?? 0} will be expired on ${tokenExp}`}
		</ThemedText>
	)
}
