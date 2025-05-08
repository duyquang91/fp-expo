import { jwtDecode } from 'jwt-decode'
import { Platform } from 'react-native'

export const fetchAPI = (
	url: string,
	options: RequestInit = {},
): Promise<Response> => {
	return fetch(
		Platform.OS === 'web' ? `https://corsproxy.io/?url=${url}` : url,
		options,
	)
}

export const isAuthExpired = (token: string): boolean => {
	const timeInterval = jwtDecode<{ expires: number }>(token).expires
	return timeInterval > 0 && timeInterval <= Date.now() / 1000
}

export const getAuthInterval = (token: string): number => {
    return jwtDecode<{ expires: number }>(token).expires
}
