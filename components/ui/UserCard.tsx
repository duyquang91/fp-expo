import { Colors } from '@/constants/Colors'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import { useThemeColor } from '@/hooks/useThemeColor'
import { getAuthInterval, isAuthExpired } from '@/utils'
import { MaterialIcons } from '@expo/vector-icons'
import React, { FC } from 'react'
import { StyleSheet, TouchableHighlight, useColorScheme } from 'react-native'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { IconThemeText } from './IconThemeText'

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
			{order && !isAuthExpired(user.authToken) && (
				<TouchableHighlight>
					<MaterialIcons
						name="add"
						size={24}
						color={
							colorScheme === 'dark' ? Colors.dark.action : Colors.light.action
						}
					/>
				</TouchableHighlight>
			)}
		</ThemedView>
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
					month: 'numeric',
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
