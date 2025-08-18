'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo, useEffect } from 'react';
import { CandlestickData, HistogramData } from 'lightweight-charts';
import { HLCAreaData } from '@/components/HLCAreaSeries';
import { fetchBinanceCandlestick, extractVolumeData, BINANCE_INTERVALS, BinanceInterval } from '@/services/binanceApi';
import { Binance30sTest } from '@/components/Binance30sTest';
import Binance30sChart from '@/components/Binance30sChart';
import CandleTables from '@/components/CandleTables';
import GaugeIndicators from '@/components/GaugeIndicators';

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
  const [activeTab, setActiveTab] = useState<'candlestick' | 'hlc' | 'combined' | 'bollinger' | 'realtime'>('candlestick');
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [interval, setInterval] = useState<BinanceInterval>('1m'); // Đổi thành 1m
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false); // Auto-refresh toggle
  const [realTimeMode, setRealTimeMode] = useState<boolean>(false); // Real-time mode toggle
  const [activeMainTab, setActiveMainTab] = useState<'gauges' | 'candles'>('gauges'); // Main tab state
  
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
    <main className="min-h-screen p-2 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-[100vw] mx-auto">
        {/* Binance 30s Test Component */}
        {/* <div className="mb-8">
          <Binance30sTest />
        </div> */}

        {/* Binance 30s Chart Component */}
        <div className="mb-6 md:mb-8">
          <Binance30sChart limit={200} symbol="BTCUSDT" title="Binance 30s Real-time Chart" />
        </div>

        {/* Tabs Container */}
        <div className="mb-2 md:mb-8">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={() => setActiveMainTab('gauges')}
              className={`text-lg font-medium transition-colors ${
                activeMainTab === 'gauges'
                  ? 'text-white border-b-2 border-orange-500 pb-1'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Indicators
            </button>
            <button
              onClick={() => setActiveMainTab('candles')}
              className={`text-lg font-medium transition-colors ${
                activeMainTab === 'candles'
                  ? 'text-white border-b-2 border-orange-500 pb-1'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Last Results
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeMainTab === 'gauges' && (
              <div>
                <GaugeIndicators />
              </div>
            )}
            
            {activeMainTab === 'candles' && (
              <div>
                <CandleTables symbol="BTCUSDT" autoRefresh={false} refreshInterval={30000} />
              </div>
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
      </div>
    </main>
  );
} 