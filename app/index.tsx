import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Platform, SafeAreaView, TouchableOpacity } from 'react-native'

export default function HomeContentLayout() {
	const [getData, setData] = useState<{ name: string; authToken: string }[]>([])
	const [isLoading, setLoading] = useState(false)
	const { refresh } = useLocalSearchParams()

	const onRefresh = () => {
		setLoading(true)
		fetch(
			Platform.OS === 'web'
				? 'https://cors-anywhere.herokuapp.com/https://stevedao.xyz/fp/users?group=vn'
				: 'https://stevedao.xyz/fp/users?group=vn',
		)
			.then(res => res.json())
			.then(res => {
				setData(res.data)
			})
			.catch(err => {})
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		onRefresh()
	}, [refresh])

	return (
		<ThemedView>
			<FlatList
				refreshing={isLoading}
				onRefresh={onRefresh}
				data={getData}
				renderItem={user => (
					<TouchableOpacity style={{ padding: 16, paddingRight:0 }}>
						<ThemedText>{user.item.name}</ThemedText>
						<ThemedView darkColor='gray' lightColor='gray' style={{ marginTop:8, height: 0.5 }} />
					</TouchableOpacity>
				)}
				keyExtractor={user => user.authToken}
			/>
		</ThemedView>
	)
}
