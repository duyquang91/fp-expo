import { Colors } from '@/constants/Colors'
import { GroupOrderMetaData } from '@/fpServices/fpModels'
import React, { FC } from 'react'
import { View } from 'react-native'
import { ThemedView } from '../ThemedView'
import { IconThemeText } from './IconThemeText'

export const GroupHeader: FC<{ order: GroupOrderMetaData }> = ({ order }) => {
	return (
		<ThemedView
			lightColor={Colors.light.surface}
			darkColor={Colors.dark.surface}
			style={{
				margin: 8,
				padding: 8,
				justifyContent: 'flex-start',
				alignItems: 'stretch',
				borderRadius: 4,
			}}
		>
			<View style={{ alignItems: 'center' }}>
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
					marginHorizontal: -4,
					marginVertical: 4,
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-around',
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
