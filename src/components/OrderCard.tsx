"use client"

import React from "react"
import { Button } from "./ui/button"
import { ArrowUp, ArrowDown, Copy } from "lucide-react"

interface Order {
  id: string
  created_at: string
  order_type: string
  open_price: number
  close_price?: number
  amount: number
  profit?: number
  status: string
}

interface OrderCardProps {
  order: Order
  formatDateTime: (date: string) => string
  formatPrice: (price: number) => string
  formatAmount: (amount: number) => string
  getPaymentDisplay: (order: Order) => string
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  formatDateTime,
  formatPrice,
  formatAmount,
  getPaymentDisplay
}) => {
  const isBuy = order.order_type === "BUY"
  const isWin = order.payout_amount && order.payout_amount > 0

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white font-medium">BTC/USDT</div>
        <div className="text-gray-400 text-sm">{formatDateTime(order.created_at)}</div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Bạn chọn */}
          <div>
            <div className="text-gray-400 text-sm mb-1">Bạn chọn</div>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded flex items-center justify-center ${
                isBuy ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {isBuy ? (
                  <ArrowUp className="w-3 h-3 text-white" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-white text-sm">
                {isBuy ? 'Mua' : 'Bán'}
              </span>
            </div>
          </div>

          {/* Giá mở */}
          <div>
            <div className="text-gray-400 text-sm mb-1">Giá mở</div>
            <div className="text-white text-sm">{formatPrice(order.open_price)}</div>
          </div>

          {/* Giá trị */}
          <div>
            <div className="text-gray-400 text-sm mb-1">Giá trị</div>
            <div className="text-white text-sm">{formatAmount(order.amount)}</div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Copy OrderId Button */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyOrderId}
              className="w-full border-white text-white hover:bg-gray-700 text-xs py-2"
            >
              <Copy className="w-3 h-3 mr-1" />
              Sao chép OrderId
            </Button>
          </div>

          {/* Giá đóng */}
          <div>
            <div className="text-gray-400 text-sm mb-1">Giá đóng</div>
            <div className="text-white text-sm">
              {order.close_price ? formatPrice(order.close_price) : '-'}
            </div>
          </div>

          {/* Thanh toán */}
          <div>
            <div className="text-gray-400 text-sm mb-1">Thanh toán</div>
            <div className={`text-sm font-medium ${
              isWin ? 'text-green-400' : isWin === false ? 'text-red-400' : 'text-white'
            }`}>
              {getPaymentDisplay(order)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
