'use client'

import { useState, useEffect } from 'react'
import { BettingOrder } from '@/lib/api/betting'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { useBettingStore } from '@/stores/betting-store'
import BettingStatsPanel from '@/components/BettingStatsPanel'
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext'
import { OrderCard } from '@/components/OrderCard'

interface BettingHistoryTableProps {
  orders: BettingOrder[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
  onPageChange: (page: number) => void
}

const BettingHistoryTable = ({ orders, pagination, onPageChange }: BettingHistoryTableProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  const formatAmount = (amount: number) => {
    return amount.toFixed(2)
  }

  const getOrderTypeDisplay = (orderType: string) => {
    return orderType === 'BUY' ? 'Mua' : 'Bán'
  }

  const getOrderTypeIcon = (orderType: string) => {
    if (orderType === 'BUY') {
      return (
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Mua</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center justify-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Bán</span>
        </div>
      )
    }
  }

  const getPaymentDisplay = (order: BettingOrder) => {
    if (order.status === 'COMPLETED' && order.payout_amount) {
      const payout = parseFloat(order.payout_amount.toString())
      const amount = parseFloat(order.amount.toString())
      const profit = payout
      
      if (profit > 0) {
        return <span className="text-green-500">+{profit.toFixed(2)}</span>
      } else if (profit < 0) {
        return <span className="text-red-500">{profit.toFixed(2)}</span>
      } else {
        return <span className="text-white">0</span>
      }
    }
    return <span className="text-white">0</span>
  }

  const getSelectedDisplay = (order: BettingOrder) => {
    if (order.order_type === 'BUY') {
      return (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Mua</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Bán</span>
        </div>
      )
    }
  }

  return (
    <div className="w-full">
      {isMobile ? (
        // Mobile View - Order Cards
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              formatDateTime={formatDateTime}
              formatPrice={formatPrice}
              formatAmount={formatAmount}
              getPaymentDisplay={getPaymentDisplay}
            />
          ))}
          
          {/* Mobile Pagination */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex gap-4">
              {/* Left Arrow */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={`w-8 h-8 p-0 rounded-md border-0 bg-transparent ${
                  pagination.page <= 1 
                    ? "text-gray-500 cursor-not-allowed" 
                    : "text-white hover:bg-gray-800"
                }`}
              >
                <ChevronLeft className="!w-8 !h-8" />
              </Button>

              {/* Current Page Number */}
              <div className="flex items-center justify-center w-8 h-8">
                <span className="text-orange-400 text-lg font-semibold">
                  {pagination.page}
                </span>
              </div>

              {/* Right Arrow */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.total_pages}
                className={`w-8 h-8 p-0 rounded-md border-0 bg-transparent ${
                  pagination.page >= pagination.total_pages 
                    ? "text-gray-500 cursor-not-allowed" 
                    : "text-white hover:bg-gray-800"
                }`}
              >
                <ChevronRight className="!w-8 !h-8" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Desktop View - Table
        <>
          {/* Table */}
          <div className="bg-gray-900 rounded-lg rounded-b-none border-b-0 overflow-hidden border border-gray-700">
            <div className="overflow-x-auto" style={{ maxWidth: 'calc(100vw)' }}>
              <table className="w-full border-collapse">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3  text-sm text-center font-medium text-gray-300 border-b border-r border-gray-700">OrderID</th>
                    <th className="px-4 py-3  text-sm text-center font-medium text-gray-300 border-b border-r border-gray-700">Thời gian bắt đầu</th>
                    <th className="px-4 py-3  text-sm text-center font-medium text-gray-300 border-b border-r border-gray-700">Lựa chọn</th>
                    <th className="px-4 py-3  text-sm text-center font-medium text-gray-300 border-b border-r border-gray-700">Giá mở</th>
                    <th className="px-4 py-3  text-sm text-center font-medium text-gray-300 border-b border-r border-gray-700">Giá đóng</th>
                    <th className="px-4 py-3  text-sm text-center font-medium text-gray-300 border-b border-r border-gray-700">Giá trị</th>
                    <th className="px-4 py-3  text-sm text-center font-medium text-gray-300 border-b border-gray-700">Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/30 border-b border-gray-700/50">
                      <td className="px-4 py-3 text-sm text-center text-white font-mono border-r border-gray-700/50">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-white border-r border-gray-700/50">
                        {formatDateTime(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-r border-gray-700/50">
                        {getOrderTypeIcon(order.order_type)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-white border-r border-gray-700/50">
                        {formatPrice(parseFloat(order.open_price.toString()))}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-white border-r border-gray-700/50">
                        {order.close_price ? formatPrice(parseFloat(order.close_price.toString())) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-white border-r border-gray-700/50">
                        {formatAmount(parseFloat(order.amount.toString()))}
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-medium">
                        {getPaymentDisplay(order)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desktop Pagination */}
          <div className="rounded-b-lg flex items-center justify-end gap-4 py-3 border border-gray-700">
            <div className="flex gap-4">
              {/* Left Arrow */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={`w-8 h-8 p-0 rounded-md border-0 bg-transparent ${
                  pagination.page <= 1 
                    ? "text-gray-500 cursor-not-allowed" 
                    : "text-white hover:bg-gray-800"
                }`}
              >
                <ChevronLeft className="!w-8 !h-8" />
              </Button>

              {/* Current Page Number */}
              <div className="flex items-center justify-center w-8 h-8">
                <span className="text-orange-400 text-lg font-semibold">
                  {pagination.page}
                </span>
              </div>

              {/* Right Arrow */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.total_pages}
                className={`w-8 h-8 p-0 rounded-md border-0 bg-transparent ${
                  pagination.page >= pagination.total_pages 
                    ? "text-gray-500 cursor-not-allowed" 
                    : "text-white hover:bg-gray-800"
                }`}
              >
                <ChevronRight className="!w-8 !h-8" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { showLoading, hideLoading, setLoadingMessage } = useGlobalLoading()
  
  const {
    bettingHistory,
    pagination,
    bettingHistoryLoading,
    bettingHistoryError,
    fetchBettingHistory,
    clearBettingHistoryError
  } = useBettingStore()

  const handlePageChange = async (page: number) => {
    setCurrentPage(page)
    setLoadingMessage(`Đang tải trang ${page}...`)
    showLoading()
    
    try {
      await fetchBettingHistory({ page, limit: 10, mode: 'real' })
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingMessage('Đang tải dữ liệu dashboard...')
      showLoading()
      
      try {
        await fetchBettingHistory({ page: 1, limit: 10, mode: 'real' })
      } finally {
        hideLoading()
      }
    }

    loadInitialData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 lg:p-4">
      <div className="space-y-8">
        {/* Betting Statistics Panel */}
        <BettingStatsPanel />

        {/* Betting History Section */}
        <div>
          <h2 className="text-3xl font-semibold text-white mb-4">Lịch Sử Giao Dịch</h2>
          
          {bettingHistoryError ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
              <div className="text-red-400 text-lg mb-2">Lỗi tải dữ liệu</div>
              <div className="text-red-300 mb-4">{bettingHistoryError}</div>
              <button
                onClick={async () => {
                  clearBettingHistoryError()
                  setLoadingMessage('Đang thử lại...')
                  showLoading()
                  
                  try {
                    await fetchBettingHistory({ page: currentPage, limit: 10, mode: 'real' })
                  } finally {
                    hideLoading()
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : bettingHistory && pagination ? (
            <BettingHistoryTable
              orders={bettingHistory}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
              <div className="text-gray-400">Không có dữ liệu giao dịch</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
