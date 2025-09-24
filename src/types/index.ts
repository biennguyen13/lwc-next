// User types
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  nickname: string
  avatar: string
  type: string
  status: string
  email_verified: boolean
  is_two_fa: boolean
  created_at: string
  updated_at: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
  twoFactorToken?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: string
  refreshTokenExpiresAt: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// Profile API Response
export interface ProfileResponse {
  success: boolean
  message: string
  data: User
}

// 2FA types
export interface TwoFactorSetupData {
  secret: string
  qr_code: string
  otpauth_url: string
}

export interface TwoFactorStatus {
  enabled: boolean
}

// Wallet types
export interface WalletBalance {
  total_available_usd: number
  total_available_btc: number
  total_available_eth: number
  total_available_usdt: number
}

export interface BalanceSummary {
  real: WalletBalance
  demo: WalletBalance
}

// Trading types
export interface TradingOrder {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  amount: number
  price: number
  status: string
  created_at: string
}

// Common types
export type BettingMode = 'real' | 'demo'
export type UserType = 'USER' | 'ADMIN' | 'MODERATOR'
export type UserStatus = 'active' | 'inactive' | 'banned'
