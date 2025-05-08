import { fetchAPI } from '@/utils'
import { GroupOrderMetaData, ResponseType, UserBackend } from './fpModels'

export const fetchCurrentGroupOrderMetadata = async (
	selfAuthToken: string,
	groupOrderId: string,
): Promise<GroupOrderMetaData> => {
	const myHeaders = new Headers()
	myHeaders.append('Authorization', selfAuthToken)
	myHeaders.append('x-fp-api-key', 'corporate')
	myHeaders.append('Content-Type', 'application/json')

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
	}

	return await fetchAPI(
		`https://sg.fd-api.com/api/v5/groupie/metadata/${groupOrderId}`,
		requestOptions,
	)
		.then(async response => await response.json())
		.then(result => result.data)
		.catch(error => {
			console.error('Fail to fetch group order metadata', error)
		})
}

export async function syncRemoteDatabase(
	group: string | undefined,
): Promise<UserBackend[]> {
	let url: string
	if (group) {
		url = `https://stevedao.xyz/fp/users?group=${group}`
	} else {
		url = 'https://stevedao.xyz/fp/users'
	}
	const json = await fetchAPI(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(res => res.json())
	return (JSON.parse(JSON.stringify(json)) as ResponseType<UserBackend[]>).data
}

export async function refreshToken(userId: string): Promise<any> {
	fetchAPI(`https://stevedao.xyz/fp/users/refreshToken/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
