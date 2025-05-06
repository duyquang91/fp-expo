import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React, { useEffect, useState } from 'react'
import { FlatList, Platform, useColorScheme } from 'react-native'

export default function HomeContentLayout() {
	const [getData, setData] = useState<{ name: string; authToken: string }[]>([])
	const [isLoading, setLoading] = useState(false)

	const onRefresh = () => {
		setLoading(true)
		fetch(Platform.OS === 'web' ? 'https://cors-anywhere.herokuapp.com/https://stevedao.xyz/fp/users?group=vn' : 'https://stevedao.xyz/fp/users?group=vn')
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
	}, [])

	return (
		<ThemedView style={{ flex: 1, padding: 16 }}>
			<FlatList
				refreshing={isLoading}
				onRefresh={onRefresh}
				data={getData}
				renderItem={user => (
					<ThemedText style={{ padding: 16 }} type="default">
						{user.item.name}
					</ThemedText>
				)}
                keyExtractor={user => user.authToken}
			/>
		</ThemedView>
	)
}
