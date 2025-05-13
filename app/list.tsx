import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { GroupHeader } from '@/components/ui/GroupHeader'
import { UserCard } from '@/components/ui/UserCard'
import { Colors } from '@/constants/Colors'
import { GroupOrderMetaData, UserBackend } from '@/fpServices/fpModels'
import { isAuthExpired } from '@/utils'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { SectionList, StyleSheet, View } from 'react-native'
import * as FPServices from '../fpServices/fpServices'

export default function HomeContentLayout() {
	const [getData, setData] = useState<UserBackend[]>([])
	const [getGroupOrder, setGroupOrder] = useState<GroupOrderMetaData>()
	const [isLoading, setLoading] = useState(false)
	const { orderId, group } = useLocalSearchParams()
	const [selectedUsers, setSeclectedUsers] = useState<UserBackend[]>([])

	const onRefresh = () => {
		setLoading(true)
		FPServices.syncRemoteDatabase(group as string | undefined)
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

	const onSelectedUser = (user: UserBackend) => {
		setSeclectedUsers(prev => {
			const isSelected = prev.some(u => u.userId === user.userId)
			if (isSelected) {
				return prev.filter(u => u.userId !== user.userId)
			} else {
				return [...prev, user]
			}
		})
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
			<SectionList
				refreshing={isLoading}
				showsVerticalScrollIndicator={false}
				onRefresh={onRefresh}
				sections={[{ section: getGroupOrder, data: getData }]}
				renderSectionHeader={data =>
					data.section.section ? (
						<GroupHeader users={getData} order={data.section.section} />
					) : null
				}
				renderItem={data => (
					<UserCard
						user={data.item}
						order={getGroupOrder}
						onPress={onSelectedUser}
					/>
				)}
				stickySectionHeadersEnabled={false}
				keyExtractor={user => user.authToken}
			></SectionList>

			<View
				style={{
					height: 44,
					margin: 16,
					flexDirection: 'row',
					justifyContent: 'space-around',
				}}
			>
				<ThemedText
					lightColor={Colors.light.action}
					darkColor={Colors.dark.action}
					onPress={_ => refreshAllTokens()}
				>
					Refresh tokens
				</ThemedText>

				<ThemedText
					lightColor={Colors.light.action}
					darkColor={Colors.dark.action}
					style={{ display: selectedUsers.length === 0 ? 'none' : 'flex' }}
					// onPress={_ => }
				>
					Ready to order ({selectedUsers.length})
				</ThemedText>
			</View>
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
