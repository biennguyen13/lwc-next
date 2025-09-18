'use client'

import React from 'react'
import { SavingsIcon, BarGraphIcon } from '@/components/ui/icons/StatsIcons'

interface StatsCardsProps {
  netProfit?: string
  totalRevenue?: string
  showValues?: boolean
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  netProfit = "*****",
  totalRevenue = "*****",
  showValues = false
}) => {
  return (
    <div className="flex gap-8 mb-6">
      {/* Net Profit Card */}
      <div className="flex-1 bg-[#ea9000] rounded-lg px-8 flex items-center gap-4 h-[112px]">
        {/* Icon */}
        <div className="flex-shrink-0">
          <BarGraphIcon className="w-12 h-12 text-orange-200" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="text-orange-200 text-xl font-medium mb-1">
            Lợi nhuận ròng
          </div>
          <div className="text-white text-2xl">
            {showValues ? netProfit : "*****"}
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="flex-1 bg-teal-500 rounded-lg px-8 flex items-center gap-4 h-[112px]">
        {/* Icon */}
        <div className="flex-shrink-0">
          <SavingsIcon className="w-12 h-12 text-teal-200" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="text-teal-200 text-xl font-medium mb-1">
            Tổng doanh thu
          </div>
          <div className="text-white text-2xl">
            {showValues ? totalRevenue : "*****"}
          </div>
        </div>
      </div>
    </div>
  )
}
