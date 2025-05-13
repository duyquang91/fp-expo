import { Colors } from '@/constants/Colors'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import React, { FC } from 'react'
import { View } from 'react-native'
import { ThemedView } from '../ThemedView'
import { IconThemeText } from './IconThemeText'

export const GroupHeader: FC<{
	users: UserBackend[]
	order: GroupOrderMetaData
}> = ({ users, order }) => {
	return (
		<ThemedView
			lightColor={Colors.light.surface}
			darkColor={Colors.dark.surface}
			style={{
				margin: 16,
				padding: 18,
				marginBottom: -8,
				justifyContent: 'flex-start',
				alignItems: 'stretch',
				borderRadius: 4,
			}}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<IconThemeText
					iconName="group"
					text={
						'$' +
						users
							.reduce((acc, user) => acc + (user.allowance ?? 0), 0)
							.toString()
					}
					size={14}
					lightColor={Colors.light.info}
					darkColor={Colors.dark.info}
				/>
				<IconThemeText
					iconName="restaurant"
					text={order.vendor.name}
					size={14}
					lightColor={Colors.light.info}
					darkColor={Colors.dark.info}
				/>
			</View>
			<ThemedView
				lightColor={Colors.light.divider}
				darkColor={Colors.dark.divider}
				style={{
					height: 0.35,
					marginHorizontal: -8,
					marginVertical: 4,
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<IconThemeText
					iconName="person"
					text={order.host.name}
					size={14}
					lightColor={Colors.light.info}
					darkColor={Colors.dark.info}
				/>
				<IconThemeText
					iconName="motorcycle"
					text={order.fulfilment_time_text}
					size={14}
					lightColor={Colors.light.info}
					darkColor={Colors.dark.info}
				/>
			</View>
		</ThemedView>
	)
}
