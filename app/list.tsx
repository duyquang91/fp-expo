import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { GroupHeader } from '@/components/ui/GroupHeader'
import { UserCard } from '@/components/ui/UserCard'
import { Colors } from '@/constants/Colors'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import { useThemeColor } from '@/hooks/useThemeColor'
import { isAuthExpired } from '@/utils'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import * as FPServices from '../fpServices/fpServices'

export default function HomeContentLayout() {
	const [getData, setData] = useState<UserBackend[]>([])
	const [getGroupOrder, setGroupOrder] = useState<GroupOrderMetaData>()
	const [isLoading, setLoading] = useState(false)
	const { orderId } = useLocalSearchParams()
	const iconColor = useThemeColor({}, 'icon')

	const onRefresh = () => {
		setLoading(true)
		FPServices.syncRemoteDatabase('vn')
			.then(res => {
				setData(res)
				fetchGroupMetaData(res)
			})
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

	const fetchGroupMetaData = (users: UserBackend[]) => {
		if (users.length === 0) return
		const selfAuthToken = users.find(user => !isAuthExpired(user.authToken))
		if (selfAuthToken) {
			FPServices.fetchCurrentGroupOrderMetadata(
				selfAuthToken.authToken,
				orderId as string,
			)
				.then(res => {
					setGroupOrder(res)
					fetchAllowance(users, res)
				})
				.catch(err => alert(err.message))
		} else {
			alert('All tokens are expired, please refresh them')
		}
	}

	const fetchAllowance = async (
		users: UserBackend[],
		order: GroupOrderMetaData,
	) => {
		if (users.length === 0) return
		for (let i = 0; i < users.length; i++) {
			if (isAuthExpired(users[i].authToken)) continue
			const res = await FPServices.fetchUserAllowance(users[i], order)
			users[i].allowance = res.allowance
			setData([...users])
		}
	}

	useEffect(() => {
		onRefresh()
	}, [])

	return (
		<ThemedView
			style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'stretch',
			}}
		>
			{getGroupOrder && <GroupHeader order={getGroupOrder} />}

			<FlatList
				refreshing={isLoading}
				showsVerticalScrollIndicator={false}
				onRefresh={onRefresh}
				data={getData}
				renderItem={user => <UserCard user={user.item} order={getGroupOrder} />}
				keyExtractor={user => user.authToken}
			></FlatList>

			<ThemedText
				lightColor={Colors.light.action}
				darkColor={Colors.dark.action}
				style={{ height: 44, margin: 16, textAlign: 'center' }}
				onPress={_ => refreshAllTokens()}
			>
				Refresh expired tokens
			</ThemedText>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	header: {
		textAlign: 'center',
		fontSize: 13,
		fontWeight: 'light',
	},
	subHeader: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	subHeaderIcon: {
		marginRight: 4,
	},
})
