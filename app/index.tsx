import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React, { use } from 'react'
import { ActivityIndicator, TextInput, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fetchAPI } from '../utils'
import { router } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function RootLayout() {
	const themeColor = useColorScheme()
	const [isLoading, setIsLoading] = React.useState(false)
	const textColor = useThemeColor({}, 'text')
	const iconColor = useThemeColor({}, 'icon')

	const processLink = (link: string) => {
		setIsLoading(true)
		fetchAPI(link, { method: 'HEAD', redirect: 'follow' })
			.then(response => {
				const finalUrl = response.url
				const orderIdMatch = finalUrl.match(/groupOrderId=([^&]*)/)
				const orderId = orderIdMatch ? orderIdMatch[1] : null

				if (orderId) {
					router.push(`/list?orderId=${orderId}`)
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
					returnKeyType='go'
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
						router.push(`/list?orderId=${e.nativeEvent.text}`)
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

			<ThemedText lightColor={iconColor} darkColor={iconColor} style={{ paddingTop: 16, fontWeight: 'light', fontSize: 14 }} type="defaultSemiBold">
				You can use either Order link or id then press "Enter" on the keyboard to continue.
			</ThemedText>
		</ThemedView>
	)
}
