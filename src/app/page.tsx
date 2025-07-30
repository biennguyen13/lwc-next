'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { CandlestickData, HistogramData } from 'lightweight-charts';
import { HLCAreaData } from '@/components/HLCAreaSeries';

// Dynamic imports để tránh SSR issues
const Chart = dynamic(() => import('@/components/Chart'), { ssr: false });

// Helper functions để tạo sample data
const getDateString = (index: number) => {
  const date = new Date();
  date.setDate(date.getDate() - (100 - index));
  return Math.floor(date.getTime() / 1000) as any;
};

const generatePrice = (basePrice: number, volatility: number = 0.02) => {
  return basePrice * (1 + (Math.random() - 0.5) * volatility);
};

const generateVolume = (baseVolume: number = 1000000) => {
  return Math.floor(baseVolume * (0.5 + Math.random() * 1.5));
};

// Generate sample data
const generateCandlestickData = (): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let basePrice = 100;

  for (let i = 0; i < 100; i++) {
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
    });

    basePrice = close;
  }

  return data;
};

const generateHLCData = (): HLCAreaData[] => {
  const data: HLCAreaData[] = [];
  let basePrice = 100;

  for (let i = 0; i < 100; i++) {
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'candlestick' | 'hlc' | 'combined' | 'bollinger'>('candlestick');
  
  // Generate sample data chỉ một lần khi khởi tạo page
  const { candlestickData, hlcData, volumeData } = useMemo(() => {
    console.log('🔄 Generating datasets...'); // Debug log
    const candlestick = generateCandlestickData();
    const hlc = generateHLCData();
    const volume = generateVolumeData(candlestick);
    
    return {
      candlestickData: candlestick,
      hlcData: hlc,
      volumeData: volume,
    };
  }, []); // Empty dependency array = chỉ chạy một lần

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white transition-colors">
          Lightweight Charts với Next.js 14
        </h1>
        
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300 transition-colors">
          Demo các loại biểu đồ tài chính sử dụng Lightweight Charts và Next.js 14
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('candlestick')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'candlestick'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Candlestick
            </button>
            <button
              onClick={() => setActiveTab('hlc')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'hlc'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              HLC Area
            </button>
            <button
              onClick={() => setActiveTab('bollinger')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'bollinger'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Bollinger Bands
            </button>
            <button
              onClick={() => setActiveTab('combined')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'combined'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Combined Chart
            </button>
          </div>
        </div>

        {/* Chart Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
          {activeTab === 'candlestick' && (
            <Chart 
              candlestickData={candlestickData}
              hlcData={[]}
              volumeData={[]}
              title="Candlestick Chart (100 data points)"
            />
          )}
          
          {activeTab === 'hlc' && (
            <Chart 
            candlestickData={candlestickData}
              hlcData={[]}
              volumeData={[]}
              title="HLC Area Chart (100 data points)"
            />
          )}
          
          {activeTab === 'bollinger' && (
            <Chart 
            candlestickData={candlestickData}
              hlcData={[]}
              volumeData={[]}
              title="Bollinger Bands Chart (100 data points)"
            />
          )}

          {activeTab === 'combined' && (
            <Chart 
              candlestickData={candlestickData}
              hlcData={[]}
              volumeData={volumeData}
              title="Combined Chart - Candlestick + HLC Area + Volume + Bollinger Bands (100 data points)"
            />
          )}
        </div>

        {/* Description */}
        <div className="mt-8 text-center text-gray-600 dark:text-gray-300 transition-colors">
          <p className="mb-4">
            <strong>Features:</strong> Candlestick Chart, HLC Area Series, Volume Histogram, Bollinger Bands
          </p>
          <p className="text-sm">
            <strong>Tech Stack:</strong> Next.js 14, React 18, TypeScript, Lightweight Charts 4.2.0, Tailwind CSS
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            💡 Dataset được generate một lần khi khởi tạo page, chuyển tab không generate lại
          </p>
        </div>
      </div>
    </main>
  );
} 