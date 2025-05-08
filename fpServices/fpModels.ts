export type UserCartState = 'open' | 'locked' | 'none' | 'error'

export interface ResponseType<T> {
  success: boolean,
  message: string,
  data: T,
  statusCode: number
}

export interface UserBackend {
  name: string,
  userId: string,
  authToken: string,
  cookie: string,
  email: string
}

export interface CustomerCartStatus {
  customer_name: string
  customer_code: string
  state: UserCartState
}

export interface UserAllowance {
  allowance: number
  customer_code: string
}

export interface UserJWTToken {
  client_id: 'volo' | 'corporate'
  expires: number
  id: string
  scope: string
  token_type: string
  user_id: string
}

export interface GroupOrderMetaData {
  host: {
    name: string
    code: string
  }
  vendor: {
    name: string
    code: string
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
  lastUpdated: number,
  validTill: number,
  groupId: string | undefined,
  data: UserInfo[]
}