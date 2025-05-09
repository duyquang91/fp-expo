import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import { getAuthInterval, isAuthExpired } from '@/utils'
import { Button } from '@react-navigation/elements'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import * as FPServices from '../fpServices/fpServices'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function HomeContentLayout() {
	const [getData, setData] = useState<UserBackend[]>([])
	const [getGroupOrder, setGroupOrder] = useState<GroupOrderMetaData>()
	const [isLoading, setLoading] = useState(false)
	const { orderId } = useLocalSearchParams()
	const iconColor = useThemeColor({}, 'icon')

	const onRefresh = () => {
		setLoading(true)
		FPServices.syncRemoteDatabase('vn')
			.then(res => setData(res))
			.catch(err => alert(err.message))
			.finally(() => setLoading(false))
	}

	const refreshAllTokens = () => {
		setLoading(true)
		const users = getData.filter(user => isAuthExpired(user.authToken))
		const refreshPromises = users.map(user =>
			FPServices.refreshToken(user.userId),
		)

		Promise.allSettled(refreshPromises)
			.then(_ => onRefresh())
			.catch(err => alert(err.message))
	}

	function getTokenExpiryRemainingString(authToken: string) {
		if (isAuthExpired(authToken)) {
			return (
				<ThemedText
					darkColor="red"
					lightColor="red"
					style={{ fontStyle: 'italic', fontWeight: 'light' }}
				>
					Expired
				</ThemedText>
			)
		}
		const date = new Date(getAuthInterval(authToken) * 1000)
		return (
			<ThemedText
				darkColor="grey"
				style={{ fontStyle: 'italic', fontWeight: 'light' }}
			>
				{date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				})}
			</ThemedText>
		)
	}

	useEffect(() => {
		onRefresh()
	}, [])

	useEffect(() => {
		if (getData.length === 0) return
		const selfAuthToken = getData.find(user => !isAuthExpired(user.authToken))
		if (selfAuthToken) {
			FPServices.fetchCurrentGroupOrderMetadata(
				selfAuthToken.authToken,
				orderId as string,
			)
				.then(res => setGroupOrder(res))
				.catch(err => alert(err.message))
		} else {
			alert('All tokens are expired, please refresh them')
		}
	}, [getData])

	return (
		<ThemedView
			style={{
				flex: 1,
				padding: 16,
				flexDirection: 'column',
				justifyContent: 'flex-start',
			}}
		>
			{getGroupOrder && (
				<ThemedView
					style={{
						marginBottom: 16,
						padding: 8,
						borderRadius: 8,
						borderColor: iconColor,
						borderWidth: 0.35,
					}}
				>
					<ThemedView style={{...styles.subHeader, flexDirection: 'row', justifyContent: 'center', }}>
						<MaterialIcons color={iconColor} name='restaurant' size={14} style={styles.subHeaderIcon} />
						<ThemedText numberOfLines={1} style={styles.header}>{getGroupOrder.vendor.name}</ThemedText>
					</ThemedView>
					<ThemedView
						lightColor={iconColor}
						darkColor={iconColor}
						style={{ height: 0.35, marginTop: 8, marginBottom: 8 }}
					/>
					<ThemedView style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
					<ThemedView style={styles.subHeader}>
						<MaterialIcons color={iconColor} name='person' size={13} style={styles.subHeaderIcon} />
						<ThemedText numberOfLines={1} style={styles.header}>{getGroupOrder.host.name}</ThemedText>
					</ThemedView>

					<ThemedView style={styles.subHeader}>
						<MaterialIcons color={iconColor} name='motorcycle' size={16} style={styles.subHeaderIcon} />
						<ThemedText numberOfLines={1} style={styles.header}>{getGroupOrder.fulfilment_time_text}</ThemedText>
					</ThemedView>
					</ThemedView>
				</ThemedView>
			)}

			<FlatList
				refreshing={isLoading}
				showsVerticalScrollIndicator={false}
				onRefresh={onRefresh}
				data={getData}
				renderItem={user => (
					<ThemedView
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							borderBottomWidth: 0.35,
							borderBottomColor: 'transparent',
							paddingTop: 8,
							paddingBottom: 8,
						}}
					>
						<ThemedView style={{ flex: 1 }}>
							<ThemedText type="defaultSemiBold">{user.item.name}</ThemedText>
							{getTokenExpiryRemainingString(user.item.authToken)}
						</ThemedView>
						{getGroupOrder && (
							<Button
								variant="plain"
								disabled={isAuthExpired(user.item.authToken)}
							>
								Join & ready
							</Button>
						)}
					</ThemedView>
				)}
				keyExtractor={user => user.authToken}
			></FlatList>

			<Button
				variant="filled"
				style={{
					paddingTop: 16,
					paddingBottom: 16,
					marginTop: 8,
					marginBottom: 16,
					alignSelf: 'center',
					width: '100%',
				}}
				onPress={() => refreshAllTokens()}
			>
				Refresh expired tokens
			</Button>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	header: {
		textAlign: 'center',
		fontSize: 13,
		fontWeight: 'light'
	},
	subHeader: { 
		flexDirection: 'row', 
		justifyContent: 'flex-start', 
		alignItems: 'center' 
	},
	subHeaderIcon: {
		marginRight: 4
	}
})
