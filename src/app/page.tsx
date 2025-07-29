'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CandlestickData } from 'lightweight-charts';

// Dynamic import để tránh SSR issues
const Chart = dynamic(() => import('@/components/Chart'), {
  ssr: false,
  loading: () => <div className="chart-container flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">Loading chart...</div>
});

const CustomChart = dynamic(() => import('@/components/CustomChart'), {
  ssr: false,
  loading: () => <div className="chart-container flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">Loading custom chart...</div>
});

// Sample data
const sampleCandlestickData: CandlestickData[] = [
  { time: '2023-01-01', open: 100, high: 110, low: 90, close: 105 },
  { time: '2023-01-02', open: 105, high: 115, low: 95, close: 110 },
  { time: '2023-01-03', open: 110, high: 120, low: 100, close: 108 },
  { time: '2023-01-04', open: 108, high: 118, low: 98, close: 112 },
  { time: '2023-01-05', open: 112, high: 122, low: 102, close: 118 },
  { time: '2023-01-06', open: 118, high: 128, low: 108, close: 115 },
  { time: '2023-01-07', open: 115, high: 125, low: 105, close: 120 },
  { time: '2023-01-08', open: 120, high: 130, low: 110, close: 125 },
  { time: '2023-01-09', open: 125, high: 135, low: 115, close: 122 },
  { time: '2023-01-10', open: 122, high: 132, low: 112, close: 128 },
];

const sampleHLCData = [
  { time: '2023-01-01', high: 110, low: 90, close: 105 },
  { time: '2023-01-02', high: 115, low: 95, close: 110 },
  { time: '2023-01-03', high: 120, low: 100, close: 108 },
  { time: '2023-01-04', high: 118, low: 98, close: 112 },
  { time: '2023-01-05', high: 122, low: 102, close: 118 },
  { time: '2023-01-06', high: 128, low: 108, close: 115 },
  { time: '2023-01-07', high: 125, low: 105, close: 120 },
  { time: '2023-01-08', high: 130, low: 110, close: 125 },
  { time: '2023-01-09', high: 135, low: 115, close: 122 },
  { time: '2023-01-10', high: 132, low: 112, close: 128 },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'candlestick' | 'custom'>('candlestick');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white transition-colors">
          Lightweight Charts với Next.js
        </h1>
        
        <div className="mb-6">
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => setActiveTab('candlestick')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'candlestick'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              Candlestick Chart
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'custom'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              HLC Area Chart
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
          {activeTab === 'candlestick' && (
            <Chart 
              data={sampleCandlestickData} 
              title="Biểu đồ Candlestick" 
            />
          )}
          
          {activeTab === 'custom' && (
            <CustomChart 
              data={sampleHLCData} 
              title="Biểu đồ HLC Area" 
            />
          )}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Thông tin
          </h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors">
            <p>• <strong className="text-gray-900 dark:text-white">Candlestick Chart:</strong> Biểu đồ nến truyền thống với dữ liệu OHLC</p>
            <p>• <strong className="text-gray-900 dark:text-white">HLC Area Chart:</strong> Biểu đồ tùy chỉnh hiển thị High, Low, Close với vùng được tô màu</p>
            <p>• <strong className="text-gray-900 dark:text-white">Responsive:</strong> Tự động điều chỉnh kích thước khi thay đổi màn hình</p>
            <p>• <strong className="text-gray-900 dark:text-white">Interactive:</strong> Hỗ trợ zoom, pan, và crosshair</p>
            <p>• <strong className="text-gray-900 dark:text-white">Dark Mode:</strong> Hỗ trợ chế độ tối với toggle button</p>
          </div>
        </div>
      </div>
    </div>
  );
} 