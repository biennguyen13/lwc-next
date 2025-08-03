'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo, useEffect } from 'react';
import { CandlestickData, HistogramData } from 'lightweight-charts';
import { HLCAreaData } from '@/components/HLCAreaSeries';
import { fetchBinanceCandlestick, extractVolumeData, BINANCE_INTERVALS, BinanceInterval } from '@/services/binanceApi';
import { Binance30sTest } from '@/components/Binance30sTest';
import Binance30sChart from '@/components/Binance30sChart';

// Dynamic imports để tránh SSR issues
const Chart = dynamic(() => import('@/components/Chart'), { ssr: false });

// Helper functions để tạo sample data (fallback)
const getDateString = (index: number) => {
  const date = new Date();
  date.setDate(date.getDate() - (200 - index)); // Tăng lên 200 để có đủ data
  return Math.floor(date.getTime() / 1000) as any;
};

const generatePrice = (basePrice: number, volatility: number = 0.02) => {
  return basePrice * (1 + (Math.random() - 0.5) * volatility);
};

const generateVolume = (baseVolume: number = 1000000) => {
  return Math.floor(baseVolume * (0.5 + Math.random() * 1.5));
};

// Generate sample data - tạo 200 items (fallback)
const generateCandlestickData = (): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let basePrice = 100;

  for (let i = 0; i < 200; i++) { // Tăng lên 200 items
    const open = generatePrice(basePrice);
    const high = open * (1 + Math.random() * 0.03);
    const low = open * (1 - Math.random() * 0.03);
    const close = generatePrice(open, 0.02);

    data.push({
      time: getDateString(i),
      open,
      high,
      low,
      close,
      volume: generateVolume(),
    });

    basePrice = close;
  }

  return data;
};

const generateHLCData = (): HLCAreaData[] => {
  const data: HLCAreaData[] = [];
  let basePrice = 100;

  for (let i = 0; i < 200; i++) { // Tăng lên 200 items
    const close = generatePrice(basePrice);
    const high = close * (1 + Math.random() * 0.02);
    const low = close * (1 - Math.random() * 0.02);

    data.push({
      time: getDateString(i),
      high,
      low,
      close,
    });

    basePrice = close;
  }

  return data;
};

const generateVolumeData = (candlestickData: CandlestickData[]): HistogramData[] => {
  return candlestickData.map((item, index) => ({
    time: item.time,
    value: generateVolume(),
    color: item.close >= item.open ? '#26a69a' : '#ef5350',
  }));
};

// Helper function để lấy 120 items cuối cùng
const getLast120Items = <T,>(data: T[]): T[] => {
  return data.slice(-120); // Lấy 120 items cuối cùng
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'candlestick' | 'hlc' | 'combined' | 'bollinger'>('candlestick');
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [interval, setInterval] = useState<BinanceInterval>('1m'); // Đổi thành 1m
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false); // Auto-refresh toggle
  
  // Generate sample data chỉ một lần khi khởi tạo page (fallback)
  const { candlestickData, hlcData, volumeData } = useMemo(() => {
    console.log('🔄 Generating fallback datasets...'); // Debug log
    const candlestick = generateCandlestickData(); // 200 items
    const hlc = generateHLCData(); // 200 items
    const volume = generateVolumeData(candlestick); // 200 items
    
    return {
      candlestickData: candlestick, // Giữ nguyên 200 items để Chart component xử lý
      hlcData: hlc, // Giữ nguyên 200 items để Chart component xử lý
      volumeData: volume, // Giữ nguyên 200 items để Chart component xử lý
    };
  }, []); // Empty dependency array = chỉ chạy một lần

  // State cho real data từ Binance
  const [realCandlestickData, setRealCandlestickData] = useState<CandlestickData[]>([]);
  const [realVolumeData, setRealVolumeData] = useState<HistogramData[]>([]);

  // Fetch data từ Binance API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching data for', symbol, 'with interval', interval);
      
      const candlestickData = await fetchBinanceCandlestick(symbol, interval, 200); // Giảm xuống 200 items
      const volumeData = extractVolumeData(candlestickData);
      
      setRealCandlestickData(candlestickData);
      setRealVolumeData(volumeData);
      
      console.log('✅ Successfully fetched real data:', candlestickData.length, 'items');
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data khi component mount hoặc khi symbol/interval thay đổi
  useEffect(() => {
    fetchData();
  }, [symbol, interval]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refreshing data...');
      fetchData();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [autoRefresh, symbol, interval]);

  // Sử dụng real data nếu có, không thì dùng fallback data
  const finalCandlestickData = realCandlestickData.length > 0 ? realCandlestickData : candlestickData;
  const finalVolumeData = realVolumeData.length > 0 ? realVolumeData : volumeData;

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white transition-colors">
          Lightweight Charts với Next.js 14
        </h1>
        
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300 transition-colors">
          Demo các loại biểu đồ tài chính sử dụng Lightweight Charts và Next.js 14
        </p>

        {/* Binance 30s Test Component */}
        <div className="mb-8">
          <Binance30sTest />
        </div>

        {/* Binance 30s Chart Component */}
        <div className="mb-8">
          <Binance30sChart symbol="BTCUSDT" limit={150} title="Binance 30s Real-time Chart" />
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-6 space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Symbol:
            </label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="BTCUSDT">BTCUSDT</option>
              <option value="ETHUSDT">ETHUSDT</option>
              <option value="ADAUSDT">ADAUSDT</option>
              <option value="DOTUSDT">DOTUSDT</option>
              <option value="LINKUSDT">LINKUSDT</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Interval:
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value as BinanceInterval)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {Object.entries(BINANCE_INTERVALS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-refresh:
            </label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            >
              {autoRefresh ? 'ON' : 'OFF'}
            </button>
            {autoRefresh && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (30s)
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
            <p className="text-sm">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-xs mt-1">
              Using fallback data. Please check your internet connection and try again.
            </p>
          </div>
        )}

   

        {/* Chart Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">

        <Chart 
              candlestickData={finalCandlestickData}
              hlcData={[]}
              volumeData={finalVolumeData}
              title={`${symbol} Combined Chart - Candlestick + HLC Area + Volume + Bollinger Bands (${interval}) - 150 data points`}
            />
        </div>

        {/* Description */}
        <div className="mt-8 text-center text-gray-600 dark:text-gray-300 transition-colors">
          <p className="mb-4">
            <strong>Features:</strong> Real-time data from Binance API, Candlestick Chart, HLC Area Series, Volume Histogram, Bollinger Bands, MA7, MA25
          </p>
          <p className="text-sm">
            <strong>Tech Stack:</strong> Next.js 14, React 18, TypeScript, Lightweight Charts 4.2.0, Tailwind CSS, Binance API
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            💡 Data được fetch từ Binance API, có fallback data nếu API không hoạt động
          </p>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            ⚠️ Binance API chỉ hỗ trợ interval tối thiểu 1 phút. Auto-refresh mỗi 30s để cập nhật data gần nhất.
          </p>
        </div>
      </div>
    </main>
  );
} 