import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import React from 'react'
import { ActivityIndicator, TextInput, useColorScheme } from 'react-native'
import { fetchAPI } from '../utils'
import SegmentedControl, {} from '@react-native-segmented-control/segmented-control'

export default function RootLayout() {
	const themeColor = useColorScheme()
	const [isLoading, setIsLoading] = React.useState(false)
	const textColor = useThemeColor({}, 'text')
	const iconColor = useThemeColor({}, 'icon')
	const [group, setGroup] = React.useState('vn')

	const processLink = (link: string) => {
		setIsLoading(true)
		fetchAPI(link, { method: 'HEAD', redirect: 'follow' })
			.then(response => {
				const finalUrl = response.url
				const orderIdMatch = finalUrl.match(/groupOrderId=([^&]*)/)
				const orderId = orderIdMatch ? orderIdMatch[1] : null

				if (orderId) {
					router.push(`/list?orderId=${orderId}&group=${group}`)
				} else {
					alert('No orderId found in the URL')
				}
			})
			.catch(error => {
				alert(`Error fetching URL: ${error.message}`)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	return (
		<ThemedView style={{ flex: 1, padding: 24 }}>
			<ThemedText type="defaultSemiBold">Group:</ThemedText>
			<SegmentedControl 
			values={['vn', 'coffee-gang', 'dex']} 
			onValueChange={value => setGroup(value)}
			selectedIndex={0}
			style={{ marginVertical: 8 }}
			/>

			<ThemedText type="defaultSemiBold">Enter order link:</ThemedText>
			<ThemedView
				style={{
					alignSelf: 'flex-start',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
				}}
			>
				<TextInput
					// placeholder="Dismiss keyboard to start"
					onSubmitEditing={e => processLink(e.nativeEvent.text)}
					clearButtonMode="always"
					returnKeyType="go"
					style={{
						flex: 1,
						color: textColor,
						borderWidth: 0.5,
						borderColor: iconColor,
						borderRadius: 4,
						padding: 8,
						marginTop: 8,
					}}
				/>
				<ActivityIndicator
					style={{
						padding: 8,
						marginTop: 8,
						display: isLoading ? 'flex' : 'none',
					}}
				/>
			</ThemedView>

			<ThemedText style={{ paddingTop: 16 }} type="defaultSemiBold">
				Enter order id:
			</ThemedText>
			<ThemedView
				style={{
					alignSelf: 'flex-start',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
				}}
			>
				<TextInput
					// placeholder="Dismiss keyboard to start"
					onSubmitEditing={e =>
						router.push(`/list?orderId=${e.nativeEvent.text}&group=${group}`)
					}
					clearButtonMode="always"
					returnKeyType="go"
					style={{
						flex: 1,
						color: textColor,
						borderWidth: 0.5,
						borderColor: iconColor,
						borderRadius: 4,
						padding: 8,
						marginTop: 8,
					}}
				/>
			</ThemedView>

			<ThemedText
				lightColor={iconColor}
				darkColor={iconColor}
				style={{ paddingTop: 16, fontWeight: 'light', fontSize: 14 }}
				type="defaultSemiBold"
			>
				You can use either Order link or id then press "Enter" on the keyboard
				to continue.
			</ThemedText>
		</ThemedView>
	)
}
