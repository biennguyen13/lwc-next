'use client'

import { useState, useEffect } from 'react'
import { BettingOrder } from '@/lib/api/betting'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { useBettingStore } from '@/stores/betting-store'
import BettingStatsPanel from '@/components/BettingStatsPanel'
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext'

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

  // Generate pagination items with ellipsis logic
  const generatePaginationItems = () => {
    const { page, total_pages } = pagination
    const items = []
    
    if (total_pages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= total_pages; i++) {
        items.push(i)
      }
    } else {
      // Always show first page
      items.push(1)
      
      if (page <= 4) {
        // Show first 5 pages + ellipsis + last page
        for (let i = 2; i <= 5; i++) {
          items.push(i)
        }
        items.push('...')
        items.push(total_pages)
      } else if (page >= total_pages - 3) {
        // Show first page + ellipsis + last 5 pages
        items.push('...')
        for (let i = total_pages - 4; i <= total_pages; i++) {
          items.push(i)
        }
      } else {
        // Show first page + ellipsis + current page range + ellipsis + last page
        items.push('...')
        for (let i = page - 1; i <= page + 1; i++) {
          items.push(i)
        }
        items.push('...')
        items.push(total_pages)
      }
    }
    
    return items
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

  return (
    <div className="w-full">
      {/* Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">OrderID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Thời gian bắt đầu</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Lựa chọn</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Giá mở</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Giá đóng</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Giá trị</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Thanh toán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-white font-mono">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {formatDateTime(order.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {getOrderTypeIcon(order.order_type)}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {formatPrice(parseFloat(order.open_price.toString()))}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {order.close_price ? formatPrice(parseFloat(order.close_price.toString())) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {formatAmount(parseFloat(order.amount.toString()))}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {getPaymentDisplay(order)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {generatePaginationItems().map((item, index) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-400 text-sm"
                >
                  ...
                </span>
              )
            }
            
            const pageNum = item as number
            return (
              <Button
                key={pageNum}
                variant={pagination.page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={
                  pagination.page === pageNum
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-transparent border-gray-600 text-white hover:bg-gray-800"
                }
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.total_pages}
          className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="space-y-8">
        {/* Betting Statistics Panel */}
        <BettingStatsPanel />

        {/* Betting History Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Lịch Sử Giao Dịch</h2>
          
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
