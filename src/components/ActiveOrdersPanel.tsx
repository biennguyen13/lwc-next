"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Clock, X } from "lucide-react"
import { useBettingStore } from "@/stores"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ActiveOrdersPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ActiveOrdersPanel({ isOpen, onClose }: ActiveOrdersPanelProps) {
  const { 
    activeOrders, 
    bettingHistory, 
    fetchActiveOrders, 
    fetchBettingHistory,
    activeOrdersLoading,
    bettingHistoryLoading 
  } = useBettingStore()
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')

  // Fetch data when panel opens or tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'open') {
        fetchActiveOrders()
      } else {
        fetchBettingHistory({ page: 1, limit: 50 })
      }
    }
  }, [isOpen, activeTab, fetchActiveOrders, fetchBettingHistory])

  // Format time for display
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return format(date, 'HH:mm:ss', { locale: vi })
    } catch {
      return '--:--:--'
    }
  }

  // Format date for display
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return format(date, 'dd/MM/yyyy', { locale: vi })
    } catch {
      return '--/--/----'
    }
  }

  // Get current date for header
  const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: vi })

  // Get orders based on active tab
  const filteredOrders = activeTab === 'open' 
    ? activeOrders.filter(order => order.status === 'PENDING')
    : bettingHistory // Use betting history for closed tab

  // Debug log to check data
  // useEffect(() => {
  //   console.log('ActiveOrdersPanel - activeOrders:', activeOrders)
  //   console.log('ActiveOrdersPanel - filteredOrders:', filteredOrders)
  //   console.log('ActiveOrdersPanel - activeTab:', activeTab)
  // }, [activeOrders, filteredOrders, activeTab])

  return (
    <div className={`bg-gray-900 border-l border-gray-700 h-full flex flex-col ${
      isOpen ? 'opacity-100' : 'opacity-0 overflow-hidden'
    }`}>
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'open'
              ? 'text-white border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          MỞ
          {activeTab === 'open' && filteredOrders.length > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {filteredOrders.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'closed'
              ? 'text-white border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ĐÓNG
        </button>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto">
        {(activeTab === 'open' ? activeOrdersLoading : bettingHistoryLoading) ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400">Đang tải...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Không có lệnh {activeTab === 'open' ? 'đang mở' : 'đã đóng'}</p>
            </div>
          </div>
        ) : (
            <div className="p-2 space-y-2">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{order.symbol}</span>
                      <Badge 
                        variant={order.mode === 'real' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {order.mode === 'real' ? 'REAL' : 'DEMO'}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Type */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      order.order_type === 'BUY' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {order.order_type === 'BUY' ? (
                        <TrendingUp className="w-4 h-4 text-white" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-white font-medium">
                      {order.order_type === 'BUY' ? 'MUA' : 'BÁN'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-white">${order.amount}</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-gray-400 text-sm">
                    {formatTime(order.created_at)}
                  </div>

                  {/* Status */}
                  {activeTab === 'closed' && (
                    <div className="mt-2">
                      <Badge 
                        variant={order.status === 'WIN' ? 'default' : order.status === 'LOSE' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {order.status === 'WIN' ? 'Thắng' : order.status === 'LOSE' ? 'Thua' : 'Đã hủy'}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  )
}
