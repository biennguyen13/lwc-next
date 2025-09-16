"use client"

import { useEffect, useState } from "react"
import { useBinance30sStore } from "@/stores/binance-30s-store"
import { CandleTable, Binance30sCandle } from "@/lib/api/binance-30s"
import { useTheme } from "./ThemeProvider"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useActiveOrders } from "@/contexts/ActiveOrdersContext"

interface CandleTablesProps {
  symbol?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

// Helper function để xác định màu của nến
const getCandleColor = (candle: Binance30sCandle): "red" | "green" | "gray" => {
  if (candle.close_price >= candle.open_price) {
    return "green"
  } else if (candle.close_price < candle.open_price) {
    return "red"
  } else {
    return "gray"
  }
}

// Component cho một ô nến
const CandleCell = ({
  candle,
  isActive = true,
  index = 0,
  isActiveOrdersOpen = false,
}: {
  candle: Binance30sCandle
  isActive?: boolean
  index?: number
  isActiveOrdersOpen?: boolean
}) => {
  const color = getCandleColor(candle)

  return (
    <div className="relative group">
      <div
        className={`
          w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded-full border-2 transition-all duration-200
          ${
            isActive
              ? color === "green"
                ? "bg-[#26a69a] border-[#26a69a] dark:bg-[#26a69a] dark:border-[#26a69a]"
                : color === "red"
                ? "bg-[#ef5350] border-[#ef5350] dark:bg-[#ef5350] dark:border-[#ef5350]"
                : "bg-gray-400 border-gray-500 dark:bg-gray-500 dark:border-gray-400"
              : "bg-gray-300 border-gray-400 dark:bg-gray-600 dark:border-gray-500"
          }
          ${isActive ? "shadow-md dark:shadow-gray-900" : "shadow-sm"}
          hover:scale-110 cursor-pointer
        `}
      />

      {/* Index indicator */}
      {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 text-xxs rounded-full flex items-center justify-center border border-white dark:border-gray-800 shadow-sm">
        {index}
      </div> */}

      {/* Tooltip */}
      {
        process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 min-w-[200px] border border-gray-200 dark:border-gray-600 backdrop-blur-sm">
          <div className="font-mono space-y-1">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                Index: {index}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xxs">
                {isActive && candle && candle.open_time > 0
                  ? `${((candle.close_time - candle.open_time) / 1000).toFixed(
                      0
                    )}s`
                  : "Empty"}
              </span>
            </div>

            {isActive && candle && candle.open_time > 0 ? (
              <>
                <div className="flex justify-between items-center text-xxs text-gray-500 dark:text-gray-400">
                  <span>Time:</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(candle.open_time).toLocaleTimeString()} -{" "}
                    {new Date(candle.close_time).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
                  <div className="flex justify-between">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      O:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {candle.open_price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      H:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {candle.high_price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">L:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {candle.low_price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">C:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {candle.close_price?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 dark:text-purple-400">
                      Vol:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {candle.volume?.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-amber-600 dark:text-amber-400">
                      Trades:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {candle.number_of_trades}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2 text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white dark:border-t-gray-800"></div>
        </div>
      )
      }
    </div>
  )
}

// Component cho một bảng nến
const CandleTableComponent = ({
  table,
  tableIndex,
  isActiveOrdersOpen = false,
}: {
  table: CandleTable
  tableIndex: number
  isActiveOrdersOpen?: boolean
}) => {
  const [candles, setCandles] = useState<Binance30sCandle[]>([])

  useEffect(() => {
    if (table.candles && table.candles.length > 0) {
      setCandles(table.candles)
    }
  }, [table.candles])

  // Tạo grid 4x5 cho 20 nến
  const renderCandleGrid = () => {
    const grid = []
    const totalCells = 20

    for (let i = 0; i < 4; i++) {
      const row = []
      for (let j = 0; j < 5; j++) {
        // Thay đổi thứ tự: từ trên xuống dưới, từ trái qua phải
        const index = j * 4 + i // Thay vì i * 5 + j
        const candle = candles[index]

        row.push(
          <div key={`${i}-${j}`} className="flex justify-center items-center">
            {candle ? (
              <CandleCell candle={candle} isActive={true} index={index} isActiveOrdersOpen={isActiveOrdersOpen} />
            ) : (
              <CandleCell
                candle={{
                  key: "",
                  symbol: "",
                  interval: "",
                  open_time: 0,
                  close_time: 0,
                  open_price: 0,
                  close_price: 0,
                  high_price: 0,
                  low_price: 0,
                  volume: 0,
                  quote_volume: 0,
                  number_of_trades: 0,
                  second: 0,
                  klines_count: 0,
                }}
                isActive={false}
                index={index}
                isActiveOrdersOpen={isActiveOrdersOpen}
              />
            )}
          </div>
        )
      }
      grid.push(
        <div key={i} className="flex justify-center gap-2">
          {row}
        </div>
      )
    }

    return grid
  }

  return (
    <div className="">
      {/* <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {table.start_time_formatted} - {table.end_time_formatted}
        </div>
      </div> */}

      {/* Thông tin về thứ tự sắp xếp */}
      {/* <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
        <div className="text-xs text-blue-700 dark:text-blue-300">
          📊 <strong>Thứ tự nến:</strong> Từ trên xuống dưới, từ trái qua phải (0-19)
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          🕐 <strong>Thời gian:</strong> {table.candles_count > 0 ? 
            `${new Date(table.candles[0].open_time).toLocaleTimeString()} - ${new Date(table.candles[table.candles.length - 1].close_time).toLocaleTimeString()}` : 
            'Chưa có dữ liệu'
          }
        </div>
      </div> */}

      <div className="space-y-2">{renderCandleGrid()}</div>

      {/* <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
          <div>Open: {table.open_price?.toFixed(2) || '0.00'}</div>
          <div>Close: {table.close_price?.toFixed(2) || '0.00'}</div>
          <div>High: {table.high_price?.toFixed(2) || '0.00'}</div>
          <div>Low: {table.low_price?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Volume: {table.total_volume?.toFixed(4) || '0.0000'} | 
          Trades: {table.total_trades || 0} | 
          Candles: {table.candles_count}/20
        </div>
        {table.has_incomplete_candles && (
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            ⚠️ {table.incomplete_candles_count} nến chưa đóng
          </div>
        )}
      </div> */}
    </div>
  )
}

export default function CandleTables({
  symbol = "BTCUSDT",
  autoRefresh = false,
  refreshInterval = 30000,
}: CandleTablesProps) {
  const {
    candleTables,
    candleTablesLoading,
    candleTablesError,
    fetchCandleTables,
  } = useBinance30sStore()

  const { theme } = useTheme()
  const { isActiveOrdersOpen } = useActiveOrders()
  const [currentSymbol, setCurrentSymbol] = useState(symbol)

  // Calculate stats from candle tables
  const calculateStats = () => {
    if (!candleTables || candleTables.length === 0) return { green: 0, red: 0 }
    
    let greenCount = 0
    let redCount = 0
    
    candleTables.forEach(table => {
      if (table.candles) {
        table.candles.forEach(candle => {
          if (candle.close_price >= candle.open_price) {
            greenCount++
          } else {
            redCount++
          }
        })
      }
    })
    
    return { green: greenCount, red: redCount }
  }

  const stats = calculateStats()

  // Handle active orders panel toggle
  useEffect(() => {
    console.log('CandleTables - Active orders panel toggled:', isActiveOrdersOpen)
    // TODO: Implement any logic needed when active orders panel opens/closes
  }, [isActiveOrdersOpen])

  // Fetch data khi component mount hoặc symbol thay đổi
  useEffect(() => {
    fetchCandleTables(currentSymbol)
  }, [currentSymbol, fetchCandleTables])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const intervalId = setInterval(() => {
      fetchCandleTables(currentSymbol)
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval, currentSymbol, fetchCandleTables])

  const handleSymbolChange = (newSymbol: string) => {
    setCurrentSymbol(newSymbol)
  }

  const handleRefresh = () => {
    fetchCandleTables(currentSymbol)
  }

  return (
    <div className="w-full mx-auto p-2 -mt-8">
      <div className="">
        {/* Stats Badges - Top Right */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-3">
            {/* Green Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm">
              <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {stats.green}
              </span>
            </div>
            
            {/* Red Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
              <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                {stats.red}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {candleTablesError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md transition-colors">
            <p className="text-sm">
              <strong>Error:</strong> {candleTablesError}
            </p>
          </div>
        )}

        {/* Loading State */}
        {candleTablesLoading && !candleTables && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        )}

        {/* Tables Grid */}
        {candleTables && candleTables.length > 0 && (
          <div className="grid gap-4 lg:gap-6 candle-tables-grid">
            {candleTables.map((table, index) => (
              <CandleTableComponent
                key={table.table_key}
                table={table}
                tableIndex={index}
                isActiveOrdersOpen={isActiveOrdersOpen}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!candleTablesLoading &&
          (!candleTables || candleTables.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2 transition-colors">
                No candle tables available
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
                Try refreshing or check your connection
              </div>
            </div>
          )}

        {/* Auto-refresh indicator */}
        {autoRefresh && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm transition-colors">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              <span>Auto-refreshing every {refreshInterval / 1000}s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
