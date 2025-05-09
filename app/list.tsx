import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import { getAuthInterval, isAuthExpired } from '@/utils'
import { Button } from '@react-navigation/elements'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import * as FPServices from '../fpServices/fpServices'

export default function HomeContentLayout() {
	const [getData, setData] = useState<UserBackend[]>([])
	const [getGroupOrder, setGroupOrder] = useState<GroupOrderMetaData | null>(null)
	const [isLoading, setLoading] = useState(false)
	const { orderId } = useLocalSearchParams()

	const onRefresh = () => {
		setLoading(true)
		FPServices.syncRemoteDatabase('vn')
			.then(res => setData(res))
			.finally(() => setLoading(false))
	}

	const refreshAllTokens = () => {
		setLoading(true)
		const users = getData.filter(user => isAuthExpired(user.authToken))
		for (const user of users) {
			FPServices.refreshToken(user.userId)
		}
		onRefresh()
	}

	function getTokenExpiryRemainingString(authToken: string) {
		if (isAuthExpired(authToken)) {
			return (
				<ThemedText
					darkColor="red"
					lightColor="red"
					style={{ fontStyle: 'italic' }}
				>
					Expired
				</ThemedText>
			)
		}
		const date = new Date(getAuthInterval(authToken) * 1000)
		return (
			<ThemedText darkColor="grey" style={{ fontStyle: 'italic' }}>
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
			<ThemedView
				style={{
					marginBottom: 16,
					padding: 16,
					borderRadius: 8,
					borderColor: 'dimgray',
					borderWidth: 0.35,
				}}
			>
				<ThemedText type="defaultSemiBold" numberOfLines={1}>
					Group: {getGroupOrder ? getGroupOrder.host.name : ''}
				</ThemedText>
				<ThemedView
					lightColor="dimgray"
					darkColor="dimgray"
					style={{ height: 0.35, marginTop: 8, marginBottom: 8 }}
				/>
				<ThemedText type="defaultSemiBold">
					Host by: {getGroupOrder ? getGroupOrder.vendor.name : ''}
				</ThemedText>
			</ThemedView>

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
							<ThemedText>{user.item.name}</ThemedText>
							{getTokenExpiryRemainingString(user.item.authToken)}
						</ThemedView>
						<Button
							variant="plain"
							disabled={isAuthExpired(user.item.authToken)}
						>
							Join & ready
						</Button>
					</ThemedView>
				)}
				keyExtractor={user => user.userId}
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
