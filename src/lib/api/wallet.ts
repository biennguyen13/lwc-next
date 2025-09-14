import { AxiosResponse } from "axios"
import apiClient from "../api"

// Types cho Wallet Balance (dựa trên deposit.route.js)
export interface WalletBalance {
  account_id: number
  token_symbol: string
  available_balance: string
  locked_balance: string
  total_deposited: string
  total_withdrawn: string
  total_balance: string
}

// Token balance interface
export interface TokenBalance {
  available_balance: string
  locked_balance: string
  total_balance: string
  total_deposited: string
  total_withdrawn: string
  available_usd: number
  locked_usd: number
  total_usd: number
  demo_credits?: string // Only for demo tokens
}

// Real/Demo balance summary interface
export interface BalanceSummary {
  total_available_usd: number
  total_locked_usd: number
  total_balance_usd: number
  token_count: number
  tokens: {
    [tokenSymbol: string]: TokenBalance
  }
}

// Main balance summary interface
export interface WalletBalanceSummary {
  account_id: number
  real: BalanceSummary
  demo: BalanceSummary
  total_available_usd: number
  total_locked_usd: number
  total_balance_usd: number
  token_count: number
}

// Types cho Deposit (dựa trên deposit.route.js)
export interface Deposit {
  id: number
  account_id: number
  tx_hash: string
  from_address: string
  to_address: string
  token_symbol: string
  amount: string
  amount_usd: string
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REJECTED'
  confirmations: number
  required_confirmations: number
  block_number: number
  detected_at: string
  processed_at: string
  credited_at: string
  created_at: string
}

export interface DepositStats {
  total_deposits: number
  total_amount: { [tokenSymbol: string]: number }
  pending_deposits: number
  confirmed_deposits: number
  failed_deposits: number
  recent_deposits: Array<{
    id: number
    amount: string
    token_symbol: string
    status: string
    created_at: string
    tx_hash: string
  }>
}

// Types cho Deposit Address (dựa trên deposit-address.route.js)
export interface DepositAddress {
  id: number
  token_symbol: string
  address: string
  network: string
  qr_code_data: string
  minimum_deposit: string
  total_deposits: number
  total_amount_deposited: string
  last_used: string
  created_at: string
}

// Types cho Withdrawal (dựa trên withdrawal.route.js)
export interface Withdrawal {
  id: number
  account_id: number
  to_address: string
  token_symbol: string
  amount: string
  fee: string
  net_amount: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  tx_hash: string
  confirmations: number
  created_at: string
  updated_at: string
}

export interface WithdrawalRequest {
  withdrawalId: number
  txHash: string
  status: string
  amount: number
  fee: number
  netAmount: number
  toAddress: string
  estimatedConfirmations: number
}

// ==================== WALLET API ====================
export const walletAPI = {
  // Lấy số dư hiện tại của user (dựa trên deposit.route.js)
  getBalance: async (tokenSymbol?: string): Promise<WalletBalance | WalletBalance[]> => {
    const response: AxiosResponse = await apiClient.get("/deposits/balance/current", {
      params: tokenSymbol ? { token_symbol: tokenSymbol } : {}
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy số dư ví thất bại")
    return response.data.data
  },

  // Lấy tổng quan số dư của user
  getBalanceSummary: async (): Promise<WalletBalanceSummary> => {
    const response: AxiosResponse = await apiClient.get("/deposits/balance/summary")
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy tổng quan số dư thất bại")
    return response.data.data
  },

  // Lấy danh sách nạp tiền của user
  getDeposits: async (params: {
    page?: number
    limit?: number
    status?: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REJECTED'
    token_symbol?: 'BNB' | 'USDT' | 'USDC' | 'BUSD' | 'CAKE'
  } = {}): Promise<{
    deposits: Deposit[]
    pagination: {
      page: number
      limit: number
      total: number
      total_pages: number
    }
  }> => {
    const response: AxiosResponse = await apiClient.get("/deposits", {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        ...(params.status && { status: params.status }),
        ...(params.token_symbol && { token_symbol: params.token_symbol }),
      },
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy danh sách nạp tiền thất bại")
    return response.data.data
  },

  // Lấy chi tiết giao dịch nạp tiền
  getDepositDetails: async (depositId: number): Promise<Deposit> => {
    const response: AxiosResponse = await apiClient.get(`/deposits/${depositId}`)
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy chi tiết giao dịch nạp tiền thất bại")
    return response.data.data
  },

  // Lấy thống kê nạp tiền của user
  getDepositStats: async (): Promise<DepositStats> => {
    const response: AxiosResponse = await apiClient.get("/deposits/stats/summary")
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy thống kê nạp tiền thất bại")
    return response.data.data
  },

  // Lấy danh sách địa chỉ nạp tiền của user
  getDepositAddresses: async (): Promise<DepositAddress[]> => {
    const response: AxiosResponse = await apiClient.get("/deposit-address")
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy danh sách địa chỉ nạp tiền thất bại")
    return response.data.data
  },

  // Lấy địa chỉ nạp tiền của user từ account route
  getMyDepositAddresses: async (): Promise<DepositAddress[]> => {
    const response: AxiosResponse = await apiClient.get("/my-deposit-addresses")
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy địa chỉ nạp tiền thất bại")
    return response.data.data
  },

  // Tạo hoặc lấy địa chỉ nạp tiền cho token
  generateDepositAddress: async (tokenSymbol: 'BNB' | 'USDT' | 'USDC' | 'BUSD' | 'CAKE'): Promise<DepositAddress> => {
    const response: AxiosResponse = await apiClient.post("/deposit-address/generate", {
      token_symbol: tokenSymbol
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Tạo địa chỉ nạp tiền thất bại")
    return response.data.data
  },

  // Lấy chi tiết địa chỉ nạp tiền
  getDepositAddressDetails: async (addressId: number): Promise<DepositAddress> => {
    const response: AxiosResponse = await apiClient.get(`/deposit-address/${addressId}`)
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy chi tiết địa chỉ nạp tiền thất bại")
    return response.data.data
  },

  // Lấy lịch sử nạp tiền của địa chỉ
  getDepositHistory: async (addressId: number, params: {
    limit?: number
    offset?: number
    status?: 'PENDING' | 'CONFIRMED' | 'FAILED'
  } = {}): Promise<{
    deposits: Deposit[]
    total: number
    limit: number
    offset: number
  }> => {
    const response: AxiosResponse = await apiClient.get(`/deposit-address/${addressId}/deposits`, {
      params: {
        limit: params.limit || 20,
        offset: params.offset || 0,
        ...(params.status && { status: params.status }),
      },
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy lịch sử nạp tiền thất bại")
    return response.data.data
  },

  // Tạo yêu cầu rút tiền
  createWithdrawal: async (params: {
    tokenSymbol: 'BNB' | 'USDT' | 'USDC' | 'BUSD' | 'CAKE'
    amount: number
    toAddress: string
    twoFactorToken?: string
    memo?: string
  }): Promise<WithdrawalRequest> => {
    const response: AxiosResponse = await apiClient.post("/withdrawals", {
      tokenSymbol: params.tokenSymbol,
      amount: params.amount,
      toAddress: params.toAddress,
      ...(params.twoFactorToken && { twoFactorToken: params.twoFactorToken }),
      ...(params.memo && { memo: params.memo })
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Tạo yêu cầu rút tiền thất bại")
    return response.data.data
  },

  // Lấy lịch sử rút tiền
  getWithdrawals: async (params: {
    page?: number
    limit?: number
  } = {}): Promise<Withdrawal[]> => {
    const response: AxiosResponse = await apiClient.get("/withdrawals", {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
      },
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy lịch sử rút tiền thất bại")
    return response.data.data
  },
}

