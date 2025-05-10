export type UserCartState = 'open' | 'locked' | 'none' | 'error'

export interface ResponseType<T> {
	success: boolean
	message: string
	data: T
	statusCode: number
}

export interface UserBackend {
	name: string
	userId: string
	authToken: string
	cookie: string
	email: string
	allowance?: number
}

export interface CustomerCartStatus {
	customer_name: string
	customer_code: string
	state: UserCartState
}

export interface UserAllowance {
	allowance: number
}

export interface UserJWTToken {
	client_id: 'volo' | 'corporate'
	expires: number
	id: string
	scope: string
	token_type: string
	user_id: string
}

export interface FPResponseType<T> {
	status_code: number
	data: T
}

export interface GroupOrderMetaData {
	fulfilment_time_text: string
	host: {
		name: string
	}
	vendor: {
		name: string
	}
}

// Local Storage
export interface CartLocalStorageData {
	order_time: string // "2023-11-06T18:00:00+0800",
	expedition_type: 'delivery' | 'pickup'
}

export interface AddressLocalStorageData {
	formatted_customer_address: string
	campus: 'OKG Level 36' | 'OKG Level 13' | null
	corporate_reference_id: number | null
}

// Model
export interface User {
	name: string
	email: string
	code: string
	authToken: string
	authTokenType: 'volo' | 'corporate'
	authTokenExpiry: number
}

export interface JsonUser {
	name: string
	email: string
	authToken: string
	cookie: string
}

export type CartStatus = Record<string, UserCartState>

export type AllowanceStatus = Record<string, number>

export type UserInfo = User & {
	key: string
	allowance: string
	status: UserCartState
}

export type BearerTokenInfo = UserJWTToken & { isCorporateAcc: boolean }

export interface AllowanceAndCartStatusInfo {
	lastUpdated: number
	validTill: number
	groupId: string | undefined
	data: UserInfo[]
}

export const getEncodedDateString = (iosString: string): string => {
  var date = new Date(iosString)
  const dateString =
    date.getFullYear() +
    '-' +
    `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}` +
    '-' +
    `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}` +
    'T' +
    `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}` +
    ':' +
    `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}` +
    ':' +
    `${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}` +
    '+0800'

  return encodeURIComponent(dateString)
}

export const getISODateTimeString = (): string => {
  const now = new Date()
  now.setDate(now.getDate() - 1)

  return now.toISOString()
}
