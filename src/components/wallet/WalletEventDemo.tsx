"use client"

import { useEffect, useState } from "react"
import { 
  useWalletBalanceEvents, 
  useWalletTransactionsEvents,
  useWalletDepositEvents,
  useWalletWithdrawalEvents,
  useWalletTransferEvents,
  useErrorEvents 
} from "@/stores"

interface EventLog {
  id: string
  type: string
  message: string
  timestamp: number
  source: string
}

export function WalletEventDemo() {
  const [eventLogs, setEventLogs] = useState<EventLog[]>([])

  const addEventLog = (type: string, message: string, source: string) => {
    const newLog: EventLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      source
    }
    setEventLogs(prev => [newLog, ...prev].slice(0, 10)) // Keep only last 10 events
  }

  // Listen to wallet balance events
  useWalletBalanceEvents((balance) => {
    addEventLog(
      'WALLET_BALANCE_UPDATED', 
      `Balance updated: ${balance.total_balance} USDT`, 
      'wallet-store'
    )
  })

  // Listen to wallet transactions events
  useWalletTransactionsEvents((transactions) => {
    addEventLog(
      'WALLET_TRANSACTIONS_UPDATED', 
      `Transactions updated: ${transactions.length} transactions`, 
      'wallet-store'
    )
  })

  // Listen to deposit events
  useWalletDepositEvents((deposit) => {
    addEventLog(
      'WALLET_DEPOSIT_CREATED', 
      `Deposit created: ${deposit.amount} ${deposit.currency}`, 
      'wallet-store'
    )
  })

  // Listen to withdrawal events
  useWalletWithdrawalEvents((withdrawal) => {
    addEventLog(
      'WALLET_WITHDRAWAL_CREATED', 
      `Withdrawal created: ${withdrawal.amount} ${withdrawal.currency}`, 
      'wallet-store'
    )
  })

  // Listen to transfer events
  useWalletTransferEvents((transfer) => {
    addEventLog(
      'WALLET_TRANSFER_COMPLETED', 
      `Transfer completed: ${transfer.amount} ${transfer.currency}`, 
      'wallet-store'
    )
  })

  // Listen to error events
  useErrorEvents((error) => {
    addEventLog(
      'ERROR_OCCURRED', 
      `Error: ${error.error}`, 
      error.source
    )
  })

  const clearLogs = () => {
    setEventLogs([])
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Wallet Events Monitor
        </h3>
        <button
          onClick={clearLogs}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {eventLogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No events yet. Perform wallet actions to see events here.
          </p>
        ) : (
          eventLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
            >
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {log.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {log.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Source: {log.source}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

