import { create } from "zustand"
import { 
  walletAPI, 
  WalletBalance, 
  WalletBalanceSummary,
  Deposit, 
  Withdrawal,
  DepositAddress,
  DepositStats
} from "@/lib/api/wallet"
import { storeCommunication } from "./store-communication"

interface WalletStoreState {
  // Data
  balance: WalletBalance[] | null
  balanceSummary: WalletBalanceSummary | null
  deposits: Deposit[]
  withdrawals: Withdrawal[]
  depositAddresses: DepositAddress[]
  depositStats: DepositStats | null
  
  // Betting mode
  bettingMode: 'real' | 'demo'
  
  // Loading states
  balanceLoading: boolean
  depositsLoading: boolean
  withdrawalsLoading: boolean
  depositAddressesLoading: boolean
  
  // Error states
  balanceError: string | null
  depositsError: string | null
  withdrawalsError: string | null
  depositAddressesError: string | null
  
  // Actions
  fetchBalance: (tokenSymbol?: string) => Promise<void>
  fetchBalanceSummary: () => Promise<void>
  fetchDeposits: (params?: {
    page?: number
    limit?: number
    status?: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REJECTED'
    token_symbol?: 'BNB' | 'USDT' | 'USDC' | 'BUSD' | 'CAKE'
  }) => Promise<void>
  fetchWithdrawals: (params?: {
    page?: number
    limit?: number
  }) => Promise<void>
  refreshBalanceSummary: () => Promise<void>
  refreshDeposits: () => Promise<void>
  refreshWithdrawals: () => Promise<void>
  fetchDepositAddresses: () => Promise<void>
  fetchMyDepositAddresses: () => Promise<void>
  fetchDepositStats: () => Promise<void>
  
  // Deposit/Withdrawal actions
  generateDepositAddress: (tokenSymbol: 'BNB' | 'USDT' | 'USDC' | 'BUSD' | 'CAKE') => Promise<DepositAddress>
  createWithdrawal: (params: {
    tokenSymbol: 'BNB' | 'USDT' | 'USDC' | 'BUSD' | 'CAKE'
    amount: number
    toAddress: string
    twoFactorToken?: string
    memo?: string
  }) => Promise<void>
  
  // Betting mode actions
  setBettingMode: (mode: 'real' | 'demo') => void
  
  // Utility actions
  clearBalanceError: () => void
  clearDepositsError: () => void
  clearWithdrawalsError: () => void
  clearDepositAddressesError: () => void
  clearAll: () => void
}

export const useWalletStore = create<WalletStoreState>((set, get) => ({
  // Initial state
  balance: null,
  balanceSummary: null,
  deposits: [],
  withdrawals: [],
  depositAddresses: [],
  depositStats: null,
  bettingMode: 'demo', // Default to demo mode
  balanceLoading: false,
  depositsLoading: false,
  withdrawalsLoading: false,
  depositAddressesLoading: false,
  balanceError: null,
  depositsError: null,
  withdrawalsError: null,
  depositAddressesError: null,

  // Fetch balance
  fetchBalance: async (tokenSymbol?: string) => {
    set({ balanceLoading: true, balanceError: null })
    try {
      const balance = await walletAPI.getBalance(tokenSymbol)
      set({ balance: Array.isArray(balance) ? balance : [balance], balanceLoading: false })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitWalletBalanceUpdated(balance)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        balanceError: errorMessage,
        balanceLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'wallet-store')
    }
  },

  // Fetch balance summary
  fetchBalanceSummary: async () => {
    set({ balanceLoading: true, balanceError: null })
    try {
      const balanceSummary = await walletAPI.getBalanceSummary()
      set({ balanceSummary, balanceLoading: false })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitWalletBalanceUpdated(balanceSummary)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        balanceError: errorMessage,
        balanceLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'wallet-store')
    }
  },

  // Fetch deposits
  fetchDeposits: async (params = {}) => {
    set({ depositsLoading: true, depositsError: null })
    try {
      const result = await walletAPI.getDeposits(params)
      set({ deposits: result.deposits, depositsLoading: false })

      // Emit event để thông báo cho các components khác
      storeCommunication.emitWalletTransactionsUpdated(result.deposits)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        depositsError: errorMessage,
        depositsLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'wallet-store')
    }
  },

  // Fetch withdrawals
  fetchWithdrawals: async (params = {}) => {
    set({ withdrawalsLoading: true, withdrawalsError: null })
    try {
      const withdrawals = await walletAPI.getWithdrawals(params)
      set({ withdrawals, withdrawalsLoading: false })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitWalletTransactionsUpdated(withdrawals)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        withdrawalsError: errorMessage,
        withdrawalsLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'wallet-store')
    }
  },

  // Refresh balance summary without loading state (for auto-refresh)
  refreshBalanceSummary: async () => {
    try {
      const balanceSummary = await walletAPI.getBalanceSummary()
      set({ balanceSummary })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitWalletBalanceUpdated(balanceSummary)
    } catch (error) {
      // Silent error for auto-refresh - don't show loading or error states
      console.warn('Auto-refresh balance summary failed:', error)
    }
  },

  // Refresh deposits without loading state (for auto-refresh)
  refreshDeposits: async () => {
    try {
      const result = await walletAPI.getDeposits({})
      set({ deposits: result.deposits })
      // Emit event để thông báo cho các components khác
      storeCommunication.emitWalletTransactionsUpdated(result.deposits)
    } catch (error) {
      // Silent error for auto-refresh - don't show loading or error states
      console.warn('Auto-refresh deposits failed:', error)
    }
  },

  // Refresh withdrawals without loading state (for auto-refresh)
  refreshWithdrawals: async () => {
    try {
      const withdrawals = await walletAPI.getWithdrawals({})
      set({ withdrawals })
      // Emit event để thông báo cho các components khác
      storeCommunication.emitWalletTransactionsUpdated(withdrawals)
    } catch (error) {
      // Silent error for auto-refresh - don't show loading or error states
      console.warn('Auto-refresh withdrawals failed:', error)
    }
  },

  // Fetch deposit addresses
  fetchDepositAddresses: async () => {
    set({ depositAddressesLoading: true, depositAddressesError: null })
    try {
      const depositAddresses = await walletAPI.getDepositAddresses()
      set({ depositAddresses, depositAddressesLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        depositAddressesError: errorMessage,
        depositAddressesLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'wallet-store')
    }
  },

  // Fetch my deposit addresses from account route
  fetchMyDepositAddresses: async () => {
    set({ depositAddressesLoading: true, depositAddressesError: null })
    try {
      const depositAddresses = await walletAPI.getMyDepositAddresses()
      set({ depositAddresses, depositAddressesLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        depositAddressesError: errorMessage,
        depositAddressesLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'wallet-store')
    }
  },

  // Fetch deposit stats
  fetchDepositStats: async () => {
    try {
      const depositStats = await walletAPI.getDepositStats()
      set({ depositStats })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      storeCommunication.emitError(errorMessage, 'wallet-store')
    }
  },

  // Generate deposit address
  generateDepositAddress: async (tokenSymbol) => {
    try {
      const depositAddress = await walletAPI.generateDepositAddress(tokenSymbol)
      
      // Emit event để thông báo deposit address đã được tạo
      storeCommunication.emitWalletDepositCreated(depositAddress)
      
      // Refresh deposit addresses
      await get().fetchDepositAddresses()
      
      return depositAddress
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      storeCommunication.emitError(errorMessage, 'wallet-store')
      throw error // Re-throw to let component handle it
    }
  },

  // Create withdrawal
  createWithdrawal: async (params) => {
    try {
      const withdrawal = await walletAPI.createWithdrawal(params)
      
      // Emit event để thông báo withdrawal đã được tạo
      storeCommunication.emitWalletWithdrawalCreated(withdrawal)
      
      // Refresh balance and withdrawals after successful withdrawal
      await get().fetchBalance()
      await get().fetchWithdrawals()
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Lỗi không xác định'
      storeCommunication.emitError(errorMessage, 'wallet-store')
      throw error // Re-throw to let component handle it
    }
  },

  // Set betting mode
  setBettingMode: (mode: 'real' | 'demo') => {
    set({ bettingMode: mode })
    
    // Emit event để thông báo betting mode đã thay đổi
    storeCommunication.emitBettingModeChanged(mode)
  },

  // Clear errors
  clearBalanceError: () => set({ balanceError: null }),
  clearDepositsError: () => set({ depositsError: null }),
  clearWithdrawalsError: () => set({ withdrawalsError: null }),
  clearDepositAddressesError: () => set({ depositAddressesError: null }),
  
  // Clear all
  clearAll: () => set({
    balance: null,
    balanceSummary: null,
    deposits: [],
    withdrawals: [],
    depositAddresses: [],
    depositStats: null,
    bettingMode: 'demo', // Reset to demo mode
    balanceLoading: false,
    depositsLoading: false,
    withdrawalsLoading: false,
    depositAddressesLoading: false,
    balanceError: null,
    depositsError: null,
    withdrawalsError: null,
    depositAddressesError: null,
  }),
}))
