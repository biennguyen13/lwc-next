"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useBettingStore } from '@/stores/betting-store'
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext'
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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
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
        <h1 className="text-2xl font-bold text-white">Số Liệu B.O</h1>
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
            <CardTitle className="text-white">Trade Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-6">
                {/* Donut Chart Area */}
                <div className="flex items-center gap-6">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      {/* Win percentage */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="8"
                        strokeDasharray={`${(stats.win_rate / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                      {/* Loss percentage */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="8"
                        strokeDasharray={`${((100 - stats.win_rate) / 100) * 251.2} 251.2`}
                        strokeDashoffset={`-${(stats.win_rate / 100) * 251.2}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-400">Lượt giao dịch</span>
                      <span className="text-2xl font-bold text-white">{stats.total_orders}</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-gray-300">Tổng vòng thắng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-300">Tổng vòng hòa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="text-sm text-gray-300">Tổng vòng thua</span>
                    </div>
                  </div>
                </div>

                {/* Stats below chart */}
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Tỷ lệ thắng</p>
                    <p className="text-xl font-bold text-white">{formatNumber(stats.win_rate)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Tổng giao dịch</p>
                    <p className="text-xl font-bold text-white">
                      {hideBalance ? '*****' : formatCurrency(stats.total_volume)}
                    </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Không có dữ liệu
            </div>
          )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Net Profit Card */}
            <Card className="bg-orange-500 border-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-100">Lợi nhuận ròng</p>
                    <p className="text-xl font-bold text-white">
                      {hideBalance ? '*****' : formatCurrency(stats?.profit || 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            {/* Total Revenue Card */}
            <Card className="bg-teal-500 border-teal-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-100">Tổng doanh thu</p>
                    <p className="text-xl font-bold text-white">
                      {hideBalance ? '*****' : formatCurrency(stats?.total_income || 0)}
                    </p>
                  </div>
                  <Circle className="h-8 w-8 text-teal-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Summary */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tóm tắt giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500 transition-all duration-300"
                        style={{ width: `${stats.sell_percentage}%` }}
                      ></div>
                      <div 
                        className="h-full bg-teal-500 transition-all duration-300"
                        style={{ width: `${stats.buy_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex justify-between text-sm">
                    <span className="text-pink-400">
                      BÁN {formatNumber(stats.sell_percentage)}%
                    </span>
                    <span className="text-teal-400">
                      {formatNumber(stats.buy_percentage)}% MUA
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  Không có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BettingStatsPanel
