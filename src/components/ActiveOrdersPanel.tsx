"use client"

import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Clock, X } from "lucide-react"
import { useBettingStore, useWalletStore } from "@/stores"
import { useActiveOrders } from "@/contexts/ActiveOrdersContext"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ActiveOrdersPanelProps {
  isOpen?: boolean
  onClose?: () => void
}

export function ActiveOrdersPanel({ isOpen: propIsOpen, onClose: propOnClose }: ActiveOrdersPanelProps) {
  const {
    activeOrders,
    bettingHistory,
    fetchActiveOrders,
    fetchBettingHistory,
    activeOrdersLoading,
    bettingHistoryLoading,
  } = useBettingStore()
  const { bettingMode } = useWalletStore()
  const { 
    isActiveOrdersOpen, 
    activeOrdersTab, 
    closeActiveOrders, 
    setActiveOrdersTab 
  } = useActiveOrders()
  
  // Use props if provided, otherwise use context
  const isOpen = propIsOpen !== undefined ? propIsOpen : isActiveOrdersOpen
  const onClose = propOnClose || closeActiveOrders
  const activeTab = activeOrdersTab

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

  return (
    <div
      className={`hidden bg-gray-900 border-gray-700 h-[66vh] md:flex flex-col ${
        isOpen ? "opacity-100" : "opacity-0 overflow-hidden"
      }`}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveOrdersTab("open")}
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
          onClick={() => setActiveOrdersTab("closed")}
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
      <div className="flex-1 overflow-y-auto">
        {(
          activeTab === "open" ? activeOrdersLoading : bettingHistoryLoading
        ) ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400">Đang tải...</div>
          </div>
        ) : filteredOrders.length === 0 ? null : (
          <div className="p-1 md:p-2 space-y-2">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 rounded-lg p-1.5 border border-gray-700"
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
                        order.order_type === "BUY" ? "bg-[#31baa0]" : "bg-[#fc605f]"
                      }`}
                    >
                      {order.order_type === "BUY" ? (
                        <TrendingUp className="w-4 h-4 text-gray-200" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-gray-200" />
                      )}
                    </div>
                    <span className={`text-gray-200 font-medium text-sm ${order.order_type === "BUY" ? "" : "text-[#fc605f]"}`}>
                      {order.order_type === "BUY" ? "MUA" : "BÁN"}
                    </span>
                  </div>
                  <div className={`flex items-center space-x-1 text-sm`}>
                    <span className={`text-gray-200 ${order.order_type === "BUY" ? "" : "text-[#fc605f]"}`}>{order.amount?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}$</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-xs">
                    {formatTime(order.created_at)}
                  </div>
                  <div className={`text-sm font-semibold ${
                    order.payout_amount > 0 
                      ? 'text-[#31baa0]' 
                      : order.payout_amount === 0 
                        ? 'text-[#fc605f]' 
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
