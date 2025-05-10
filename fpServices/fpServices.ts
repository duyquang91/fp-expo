import { fetchAPI } from '@/utils'
import {
	AddressLocalStorageData,
	CartLocalStorageData,
	FPResponseType,
	getEncodedDateString,
	getISODateTimeString,
	GroupOrderMetaData,
	ResponseType,
	UserAllowance,
	UserBackend,
} from './fpModels'

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

export const fetchUserAllowance = async (
	user: UserBackend,
	order: GroupOrderMetaData,
): Promise<UserAllowance> => {
	const myHeaders = new Headers()
	myHeaders.append('Authorization', user.authToken)
	myHeaders.append('x-fp-api-key', 'corporate')
	myHeaders.append('Content-Type', 'application/json')

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
	}

	return fetch(
		`https://sg.fd-api.com/api/v5/corporate-api/allowance?fulfilment_time=${getEncodedDateString(order.fulfilment_time)}&vertical=restaurants&expedition_type=${order.expedition_type}&company_location_id=${order.corporate.location_id}`,
		requestOptions,
	)
		.then(res => res.json())
		.then(json => {
			const obj = JSON.parse(
				JSON.stringify(json),
			) as FPResponseType<UserAllowance[]>
			if (obj.status_code === 200) {
				return json.data[0]
			} else {
				throw new Error(`Failed to fetch users: ${JSON.stringify(json)}`)
			}
		})
}
