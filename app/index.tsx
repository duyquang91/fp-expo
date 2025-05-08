import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import { ActivityIndicator, TextInput, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fetchAPI } from '../utils'
import { router } from 'expo-router'

export default function RootLayout() {
	const themeColor = useColorScheme()
    const [ isLoading, setIsLoading ] = React.useState(false)

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
			}).finally(() => {
                setIsLoading(false)
            }
        )
	}

	return (
		<ThemedView style={{flex: 1, padding: 24}}>
			<ThemedText type='defaultSemiBold'>Enter order link:</ThemedText>
			<ThemedView style={{ alignSelf:'flex-start', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
				<TextInput
					placeholder="Dismiss keyboard to start"
					onSubmitEditing={e => processLink(e.nativeEvent.text)}
					clearButtonMode="always"
					style={{
                        flex: 1,
						color: themeColor === 'dark' ? '#fff' : '#000',
						borderWidth: 0.5,
						borderColor: 'gray',
						borderRadius: 4,
						padding: 8,
						marginTop: 8,
					}}
				/>
                <ActivityIndicator style={{padding: 8, marginTop: 8, display: isLoading ? 'flex': 'none'}}/>
			</ThemedView>
		</ThemedView>
	)
}


