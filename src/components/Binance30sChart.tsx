'use client';

import { useEffect, useState } from 'react';
import { CandlestickData, HistogramData } from 'lightweight-charts';
import { useBinance30sStore } from '@/stores';
import Chart from './Chart';

// Convert Binance 30s data sang Lightweight Charts format
const convertBinance30sToCandlestick = (binance30sData: any[]): CandlestickData[] => {
  return binance30sData.map((candle) => ({
    time: Math.floor(candle.open_time / 1000) as any, // Convert milliseconds to seconds
    open: candle.open_price,
    high: candle.high_price,
    low: candle.low_price,
    close: candle.close_price,
  }));
};

// Convert Binance 30s data sang Volume format
const convertBinance30sToVolume = (binance30sData: any[]): HistogramData[] => {
  return binance30sData.map((candle) => ({
    time: Math.floor(candle.open_time / 1000) as any,
    value: candle.volume,
    color: candle.close_price >= candle.open_price ? '#26a69a' : '#ef5350',
  }));
};

// Convert Binance 30s data sang HLC format cho Bollinger Bands
const convertBinance30sToHLC = (binance30sData: any[]): any[] => {
  return binance30sData.map((candle) => ({
    time: Math.floor(candle.open_time / 1000) as any,
    high: candle.high_price,
    low: candle.low_price,
    close: candle.close_price,
  }));
};

interface Binance30sChartProps {
  symbol?: string;
  limit?: number;
  title?: string;
}

export default function Binance30sChart({ 
  symbol = "BTCUSDT", 
  limit = 150, 
  title = "Binance 30s Candles" 
}: Binance30sChartProps) {
  const { 
    candles, 
    candlesLoading, 
    candlesError, 
    fetchCandles 
  } = useBinance30sStore();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [chartData, setChartData] = useState<{
    candlestickData: CandlestickData[];
    hlcData: any[];
    volumeData: HistogramData[];
  }>({
    candlestickData: [],
    hlcData: [],
    volumeData: [],
  });

  // Fetch data khi component mount
  useEffect(() => {
    fetchCandles({ symbol, limit });
  }, [symbol, limit, fetchCandles]);

  // Reset initial loading khi data được load thành công
  useEffect(() => {
    if (candles && candles.length > 0 && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [candles, isInitialLoading]);

  // Convert data khi candles thay đổi
  useEffect(() => {
    if (candles && candles.length > 0) {
      console.log('🔄 Converting Binance 30s data to chart format...');
      
      const candlestickData = convertBinance30sToCandlestick(candles);
      const volumeData = convertBinance30sToVolume(candles);
      const hlcData = convertBinance30sToHLC(candles);

      console.log('✅ Converted data:', {
        candlesticks: candlestickData.length,
        volume: volumeData.length,
        hlc: hlcData.length,
      });

      setChartData({
        candlestickData,
        hlcData,
        volumeData,
      });
    }
  }, [candles]);

  // Loading state - chỉ hiển thị khi lần đầu load
  if (isInitialLoading && candlesLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang tải dữ liệu Binance 30s...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (candlesError) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg p-4">
        <p className="font-semibold">Lỗi khi tải dữ liệu:</p>
        <p className="text-sm">{candlesError}</p>
        <button 
          onClick={() => fetchCandles({ symbol, limit })}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state
  if (!candles || candles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Không có dữ liệu</p>
          <button 
            onClick={() => fetchCandles({ symbol, limit })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tải dữ liệu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart 
        candlestickData={chartData.candlestickData}
        hlcData={[]}
        volumeData={chartData.volumeData}
        title={`${symbol} 30s Candles - ${candles.length} data points`}
        preserveZoom={true} // Giữ nguyên zoom khi refresh
        enableRealTime={true}
        candleWidth={15}
        limit={limit}
      />
    </div>
  );
} 