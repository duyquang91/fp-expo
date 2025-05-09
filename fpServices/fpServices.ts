import { fetchAPI } from '@/utils'
import { FPResponseType, GroupOrderMetaData, ResponseType, UserBackend } from './fpModels'

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

	return fetchAPI(
		`https://sg.fd-api.com/api/v5/groupie/metadata/${groupOrderId}`,
		requestOptions,
	)
		.then(response => response.json())
		.then(json => {
			const obj = JSON.parse(
				JSON.stringify(json),
			) as FPResponseType<GroupOrderMetaData>
			if (obj.status_code === 200) {
				return obj.data
			} else {
				throw new Error(
					`Failed to fetch group order metadata: ${JSON.stringify(obj)}`,
				)
			}
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
	return fetchAPI(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then(res => res.json())
		.then(json => {
			const obj = JSON.parse(JSON.stringify(json)) as ResponseType<
				UserBackend[]
			>
			if (json.success) {
				return json.data
			} else {
				throw new Error(`Failed to fetch users: ${JSON.stringify(json)}`)
			}
		})
}

export async function refreshToken(userId: string): Promise<any> {
	fetchAPI(`https://stevedao.xyz/fp/users/refreshToken/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
