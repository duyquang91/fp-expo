import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Platform, TouchableOpacity } from 'react-native'
import { jwtDecode } from 'jwt-decode'

export default function HomeContentLayout() {
	const [getData, setData] = useState<{ name: string; authToken: string }[]>([])
	const [isLoading, setLoading] = useState(false)
	const { refresh } = useLocalSearchParams()
    const [ error, setError ] = useState<string | null>(null)

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
				setError(null)
			})
			.catch(err => {
                setError(err.message)
				setData([])
            })
			.finally(() => {
				setLoading(false)
			})
	}

	function getTokenExpiryRemainingString (authToken: string) {
		const timeInterval = jwtDecode<{ expires: number }>(authToken).expires
		if (timeInterval > 0 && timeInterval <= Date.now() / 1000) {
			return <ThemedText darkColor='red' lightColor='red'>Expired</ThemedText>
		}
		if (timeInterval !== 0) {
		  const date = new Date(timeInterval * 1000)
		  return <ThemedText darkColor='grey'>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</ThemedText>
		} else {
		  return <></>
		}
	  }

	useEffect(() => {
		onRefresh()
	}, [refresh])

	return (
		<ThemedView>
            <ThemedText>{error}</ThemedText>
			<FlatList
				refreshing={isLoading}
				onRefresh={onRefresh}
				data={getData}
				renderItem={user => (
					<ThemedView style={{ padding: 16, borderBottomWidth: 0.5, borderBottomColor: 'gray' }}>
						<ThemedText>{user.item.name}</ThemedText>
						{getTokenExpiryRemainingString(user.item.authToken)}
					</ThemedView>
				)}
				keyExtractor={user => user.authToken}
			/>
		</ThemedView>
	)
}
