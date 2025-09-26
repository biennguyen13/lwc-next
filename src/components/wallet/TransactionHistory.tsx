"use client"

import { useWalletStore } from "@/stores"

interface TransactionHistoryProps {
  activeTab: "usdt" | "commission"
  onTabChange: (tab: "usdt" | "commission") => void
}

export function TransactionHistory({ activeTab, onTabChange }: TransactionHistoryProps) {
  const { deposits, withdrawals, depositsLoading, withdrawalsLoading } = useWalletStore()

  // Get current data based on active tab
  const currentData = activeTab === "usdt" ? [
    ...deposits.map(deposit => ({ ...deposit, _type: 'deposit' })),
    ...withdrawals.map(withdrawal => ({ ...withdrawal, _type: 'withdrawal' }))
  ] : []
  const isLoading = activeTab === "usdt" ? (depositsLoading || withdrawalsLoading) : false

  // Sort by created_at descending (newest first)
  const sortedData = currentData.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Lịch sử giao dịch
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 px-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onTabChange("usdt")}
          className={`pb-3 px-1 text-lg font-medium transition-colors ${
            activeTab === "usdt"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          USDT
        </button>
        
        <button
          onClick={() => onTabChange("commission")}
          className={`pb-3 px-1 text-lg font-medium transition-colors ${
            activeTab === "commission"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Hoa Hồng
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-32px-16px)] lg:max-w-[calc(100vw-95px-32px-16px)]">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                TX Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              sortedData.map((transaction, index) => (
                <tr key={`${transaction._type}-${transaction.id || index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(transaction.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {parseFloat(transaction.amount).toFixed(2)} {transaction.token_symbol}
                      </span>
                      {transaction._type === 'withdrawal' && transaction.fee && (
                        <span className="text-xs text-gray-500">
                          Phí: {parseFloat(transaction.fee).toFixed(2)} {transaction.token_symbol}
                        </span>
                      )}
                      {transaction.amount_usd && (
                        <span className="text-xs text-gray-500">
                          ≈ ${parseFloat(transaction.amount_usd).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction._type === 'deposit'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transaction._type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="max-w-xs truncate">
                      {transaction.tx_hash || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {transaction._type === 'deposit' ? (
                      <div className="flex flex-col text-xs">
                        <span>From: {transaction.from_address?.slice(0, 8)}...{transaction.from_address?.slice(-6)}</span>
                        <span>To: {transaction.to_address?.slice(0, 8)}...{transaction.to_address?.slice(-6)}</span>
                      </div>
                    ) : (
                      <div className="text-xs">
                        To: {transaction.to_address?.slice(0, 8)}...{transaction.to_address?.slice(-6)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'COMPLETED' || transaction.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : transaction.status === 'PENDING' || transaction.status === 'PROCESSING'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : transaction.status === 'FAILED' || transaction.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {transaction.status === 'COMPLETED' ? 'Hoàn thành' : 
                       transaction.status === 'CONFIRMED' ? 'Đã xác nhận' :
                       transaction.status === 'PENDING' ? 'Đang chờ' :
                       transaction.status === 'PROCESSING' ? 'Đang xử lý' :
                       transaction.status === 'FAILED' ? 'Thất bại' :
                       transaction.status === 'CANCELLED' ? 'Đã hủy' :
                       transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

