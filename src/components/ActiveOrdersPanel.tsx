"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Clock, X } from "lucide-react"
import { useBettingStore, useWalletStore } from "@/stores"
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
    bettingHistoryLoading,
  } = useBettingStore()
  const { bettingMode } = useWalletStore()
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open")

  // Fetch data when panel opens or tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === "open") {
        fetchActiveOrders({ mode: bettingMode })
      } else {
        fetchBettingHistory({ page: 1, limit: 50, mode: bettingMode })
      }
    }
  }, [isOpen, activeTab, fetchActiveOrders, fetchBettingHistory, bettingMode])

  // Format time for display
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return format(date, "HH:mm:ss", { locale: vi })
    } catch {
      return "--:--:--"
    }
  }

  // Format date for display
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return format(date, "dd/MM/yyyy", { locale: vi })
    } catch {
      return "--/--/----"
    }
  }

  // Get current date for header
  const currentDate = format(new Date(), "dd/MM/yyyy", { locale: vi })

  // Get orders based on active tab
  const filteredOrders =
    activeTab === "open"
      ? activeOrders.filter((order) => order.status === "PENDING")
      : bettingHistory // Use betting history for closed tab

  // Debug log to check data
  // useEffect(() => {
  //   console.log('ActiveOrdersPanel - activeOrders:', activeOrders)
  //   console.log('ActiveOrdersPanel - filteredOrders:', filteredOrders)
  //   console.log('ActiveOrdersPanel - activeTab:', activeTab)
  // }, [activeOrders, filteredOrders, activeTab])

  return (
    <div
      className={`bg-gray-900 border-l border-gray-700 h-full flex flex-col ${
        isOpen ? "opacity-100" : "opacity-0 overflow-hidden"
      }`}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("open")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === "open"
              ? "text-gray-200 border-b-2 border-orange-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          MỞ
          {activeTab === "open" && filteredOrders.length > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {filteredOrders.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab("closed")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === "closed"
              ? "text-gray-200 border-b-2 border-orange-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          ĐÓNG
        </button>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-120px)]">
        {(
          activeTab === "open" ? activeOrdersLoading : bettingHistoryLoading
        ) ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400">Đang tải...</div>
          </div>
        ) : filteredOrders.length === 0 ? null : (
          <div className="p-2 space-y-2">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 rounded-lg p-2 border border-gray-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-200 font-medium text-xs">
                      {order.symbol}
                    </span>

                    {order.mode === "demo" && (
                      <Badge variant={"bitcoin"} className="text-2xs">
                        {"DEMO"}
                      </Badge>
                    )}

                    <div className="flex items-center space-x-2">
                      <img
                        src="/images/btc.82491fef.png"
                        alt={order.symbol}
                        className="w-auto h-5 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Type */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        order.order_type === "BUY" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {order.order_type === "BUY" ? (
                        <TrendingUp className="w-4 h-4 text-gray-200" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-gray-200" />
                      )}
                    </div>
                    <span className="text-gray-200 font-medium text-sm">
                      {order.order_type === "BUY" ? "MUA" : "BÁN"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-gray-200">{order.amount?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}$</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    {formatTime(order.created_at)}
                  </div>
                  <div className={`text-sm font-semibold ${
                    order.payout_amount > 0 
                      ? 'text-green-600' 
                      : order.payout_amount === 0 
                        ? 'text-red-500' 
                        : 'text-gray-200'
                  }`}>
                    {order.payout_amount > 0 ? '+' : ''}{order.payout_amount?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}$
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
