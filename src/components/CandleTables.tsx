'use client';

import { useEffect, useState } from 'react';
import { useBinance30sStore } from '@/stores/binance-30s-store';
import { CandleTable, Binance30sCandle } from '@/lib/api/binance-30s';
import { useTheme } from './ThemeProvider';

interface CandleTablesProps {
  symbol?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// Helper function để xác định màu của nến
const getCandleColor = (candle: Binance30sCandle): 'red' | 'green' | 'gray' => {
  if (candle.close_price >= candle.open_price) {
    return 'green';
  } else if (candle.close_price < candle.open_price) {
    return 'red';
  } else {
    return 'gray';
  }
};

// Component cho một ô nến
const CandleCell = ({ 
  candle, 
  isActive = true,
  index = 0
}: { 
  candle: Binance30sCandle; 
  isActive?: boolean;
  index?: number;
}) => {
  const color = getCandleColor(candle);
  
  return (
    <div className="relative">
      <div 
        className={`
          w-6 h-6 rounded-full border-2 transition-all duration-200
          ${isActive 
            ? color === 'green' 
              ? 'bg-green-500 border-green-600 dark:bg-green-400 dark:border-green-500' 
              : color === 'red' 
                ? 'bg-red-500 border-red-600 dark:bg-red-400 dark:border-red-500' 
                : 'bg-gray-400 border-gray-500 dark:bg-gray-500 dark:border-gray-400'
            : 'bg-gray-300 border-gray-400 dark:bg-gray-600 dark:border-gray-500'
          }
          ${isActive ? 'shadow-md dark:shadow-gray-900' : 'shadow-sm'}
          hover:scale-110 cursor-pointer
        `}
        title={`Index: ${index} | ${candle.start_time_formatted || new Date(candle.open_time).toLocaleTimeString()}: ${candle.close_price}`}
      />
      {/* Index indicator */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 text-xxs rounded-full flex items-center justify-center  border border-white dark:border-gray-800 shadow-sm">
        {index}
      </div>
    </div>
  );
};

// Component cho một bảng nến
const CandleTableComponent = ({ 
  table, 
  tableIndex 
}: { 
  table: CandleTable; 
  tableIndex: number;
}) => {
  const [candles, setCandles] = useState<Binance30sCandle[]>([]);

  useEffect(() => {
    if (table.candles && table.candles.length > 0) {
      setCandles(table.candles);
    }
  }, [table.candles]);

  // Tạo grid 4x5 cho 20 nến
  const renderCandleGrid = () => {
    const grid = [];
    const totalCells = 20;
    
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        // Thay đổi thứ tự: từ trên xuống dưới, từ trái qua phải
        const index = j * 4 + i; // Thay vì i * 5 + j
        const candle = candles[index];
        
        row.push(
          <div key={`${i}-${j}`} className="flex justify-center items-center">
            {candle ? (
              <CandleCell 
                candle={candle} 
                isActive={true}
                index={index}
              />
            ) : (
              <CandleCell 
                candle={{
                  key: '',
                  symbol: '',
                  interval: '',
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
                  klines_count: 0
                }} 
                isActive={false}
                index={index}
              />
            )}
          </div>
        );
      }
      grid.push(
        <div key={i} className="flex space-x-2">
          {row}
        </div>
      );
    }
    
    return grid;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50 transition-colors duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Table {tableIndex + 1}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {table.start_time_formatted} - {table.end_time_formatted}
        </div>
      </div>
      
      {/* Thông tin về thứ tự sắp xếp */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
        <div className="text-xs text-blue-700 dark:text-blue-300">
          📊 <strong>Thứ tự nến:</strong> Từ trên xuống dưới, từ trái qua phải (0-19)
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          🕐 <strong>Thời gian:</strong> {table.candles_count > 0 ? 
            `${new Date(table.candles[0].open_time).toLocaleTimeString()} - ${new Date(table.candles[table.candles.length - 1].close_time).toLocaleTimeString()}` : 
            'Chưa có dữ liệu'
          }
        </div>
      </div>
      
      <div className="space-y-2">
        {renderCandleGrid()}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
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
      </div>
    </div>
  );
};

export default function CandleTables({ 
  symbol = 'BTCUSDT', 
  autoRefresh = true, 
  refreshInterval = 30000 
}: CandleTablesProps) {
  const { 
    candleTables, 
    candleTablesLoading, 
    candleTablesError, 
    fetchCandleTables 
  } = useBinance30sStore();

  const { theme } = useTheme();
  const [currentSymbol, setCurrentSymbol] = useState(symbol);

  // Fetch data khi component mount hoặc symbol thay đổi
  useEffect(() => {
    fetchCandleTables(currentSymbol);
  }, [currentSymbol, fetchCandleTables]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchCandleTables(currentSymbol);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, currentSymbol, fetchCandleTables]);

  const handleSymbolChange = (newSymbol: string) => {
    setCurrentSymbol(newSymbol);
  };

  const handleRefresh = () => {
    fetchCandleTables(currentSymbol);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 transition-colors duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Candle Tables - {currentSymbol}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
              5 bảng nến gần nhất, mỗi bảng 20 nến 30s (10 phút)
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 transition-colors">
              💡 Chỉ hiển thị nến đã đóng hoàn toàn
            </p>
          </div>
          
          {/* <div className="flex items-center space-x-4">
            <select
              value={currentSymbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              <option value="BTCUSDT">BTCUSDT</option>
              <option value="ETHUSDT">ETHUSDT</option>
              <option value="ADAUSDT">ADAUSDT</option>
              <option value="DOTUSDT">DOTUSDT</option>
              <option value="LINKUSDT">LINKUSDT</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={candleTablesLoading}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {candleTablesLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div> */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {candleTables.map((table, index) => (
              <CandleTableComponent 
                key={table.table_key} 
                table={table} 
                tableIndex={index} 
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!candleTablesLoading && (!candleTables || candleTables.length === 0) && (
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
  );
}
