"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useBettingStore } from '@/stores/betting-store'
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext'
import { StatsCards } from '@/components/StatsCards'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Target,
  RefreshCw,
  Calendar,
  Coins,
  Eye,
  EyeOff,
  Activity,
  Circle
} from 'lucide-react'

interface BettingStatsPanelProps {
  className?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

const BettingStatsPanel: React.FC<BettingStatsPanelProps> = ({ 
  className, 
  autoRefresh = true,
  refreshInterval = 30000 
}) => {
  const [selectedSymbol, setSelectedSymbol] = React.useState<string>('ALL')
  const [hideBalance, setHideBalance] = useState(false)
  const { showLoading, hideLoading, setLoadingMessage } = useGlobalLoading()
  const { 
    bettingStats: stats, 
    bettingStatsLoading: loading, 
    bettingStatsError: error, 
    fetchBettingStats,
    refreshBettingStats
  } = useBettingStore()

  const handleSymbolChange = async (value: string) => {
    setSelectedSymbol(value)
    // Convert 'ALL' back to undefined for API call
    const symbolParam = value === 'ALL' ? undefined : value
    
    setLoadingMessage(`Đang tải thống kê ${value === 'ALL' ? 'tất cả' : value}...`)
    showLoading()
    
    try {
      await fetchBettingStats({ symbol: symbolParam })
    } finally {
      hideLoading()
    }
  }

  const handleRefresh = async () => {
    const symbolParam = selectedSymbol === 'ALL' ? undefined : selectedSymbol
    
    setLoadingMessage('Đang làm mới thống kê...')
    showLoading()
    
    try {
      await fetchBettingStats({ symbol: symbolParam })
    } finally {
      hideLoading()
    }
  }

  // Initial fetch
  useEffect(() => {
    const loadInitialStats = async () => {
      setLoadingMessage('Đang tải thống kê betting...')
      showLoading()
      
      try {
        await fetchBettingStats({ symbol: undefined }) // Start with 'ALL' (no symbol filter)
      } finally {
        hideLoading()
      }
    }

    loadInitialStats()
  }, [])

  // Auto refresh (silent - no global loading)
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      const symbolParam = selectedSymbol === 'ALL' ? undefined : selectedSymbol
      refreshBettingStats({ symbol: symbolParam })
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, selectedSymbol, refreshBettingStats])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatCurrency = (num: number) => {
    return `$${new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)}`
  }

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-600'
    if (profit < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 60) return 'text-green-600'
    if (winRate >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Số Liệu B.O</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setHideBalance(!hideBalance)}
            className="text-gray-400 hover:text-white"
          >
            {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="ml-2">Ẩn số dư</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Trade Stats */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Trade Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-6">
                {/* Donut Chart Area */}
                <div className="flex items-center gap-6 justify-around">
                  {/* Donut Chart */}
                  <div className="relative w-44 h-44">
                    <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      {/* Win percentage - Blue */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#2d55fd"
                        strokeWidth="8"
                        strokeDasharray={`${(stats.win_rate / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                      {/* Loss percentage - Red/Pink */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ff2a55"
                        strokeWidth="8"
                        strokeDasharray={`${((100 - stats.win_rate) / 100) * 251.2} 251.2`}
                        strokeDashoffset={`-${(stats.win_rate / 100) * 251.2}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-base text-gray-200">Lượt giao dịch</span>
                      <span className="text-2xl  text-white">{stats.total_orders}</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-orange-500 bg-transparent"></div>
                      <span className="text-base text-white">Tổng vòng thắng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-transparent"></div>
                      <span className="text-base text-white">Tổng vòng hòa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-pink-500 bg-transparent"></div>
                      <span className="text-base text-white">Tổng vòng thua</span>
                    </div>
                  </div>
                </div>

                {/* Stats below chart */}
                <div className="flex justify-between items-center">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-400">Tỷ lệ thắng</p>
                    <p className="text-xl font-bold text-white">{formatNumber(stats.win_rate)}%</p>
                  </div>
                  
                  {/* Vertical divider */}
                  <div className="w-px h-12 bg-gray-400 mx-4"></div>
                  
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-400">Tổng giao dịch</p>
                    <p className="text-xl font-bold text-white">
                      {hideBalance ? '*****' : formatCurrency(stats.total_volume)}
                    </p>
                  </div>
                </div>
              </div>
          )}
          </CardContent>
        </Card>

        {/* Right Column */}
        {stats && <div className="space-y-6">
          {/* Top Cards */}
          <StatsCards 
            netProfit={formatCurrency(stats?.profit || 0)}
            totalRevenue={formatCurrency(stats?.total_income || 0)}
            showValues={!hideBalance}
          />

          {/* Trading Summary */}
          <div className="space-y-4">
            <p className='text-center text-lg text-gray-400'>Tóm tắt giao dịch</p>
            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full flex h-2.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff2a55] transition-all duration-300"
                  style={{ width: `${stats.sell_percentage}%` }}
                ></div>
                <div 
                  className="h-full bg-[#31baa0] transition-all duration-300"
                  style={{ width: `${stats.buy_percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between">
              <span className="text-[#ff2a55]">
                BÁN {formatNumber(stats.sell_percentage)}%
              </span>
              <span className="text-[#31baa0]">
                {formatNumber(stats.buy_percentage)}% MUA
              </span>
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default BettingStatsPanel
