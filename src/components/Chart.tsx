'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, CandlestickData } from 'lightweight-charts';
import { useTheme } from './ThemeProvider';
import { HLCAreaSeries, HLCAreaData } from './HLCAreaSeries';

interface ChartProps {
  candlestickData: CandlestickData[];
  hlcData: HLCAreaData[];
  title?: string;
}

export default function Chart({ candlestickData, hlcData, title = 'Biểu đồ giá' }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const hlcSeriesRef = useRef<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      // Tạo chart với theme
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { 
            color: theme === 'dark' ? '#1f2937' : '#ffffff' 
          },
          textColor: theme === 'dark' ? '#f9fafb' : '#333',
        },
        grid: {
          vertLines: { 
            color: theme === 'dark' ? '#374151' : '#f0f0f0' 
          },
          horzLines: { 
            color: theme === 'dark' ? '#374151' : '#f0f0f0' 
          },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Thêm candlestick series
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        title: 'Candlestick',
      });

      // Thêm HLC Area series
      const customSeriesView = new HLCAreaSeries();
      hlcSeriesRef.current = chartRef.current.addCustomSeries(customSeriesView, {
        highLineColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(220, 38, 38, 0.6)',
        lowLineColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(37, 99, 235, 0.6)',
        closeLineColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(5, 150, 105, 0.6)',
        areaBottomColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
        areaTopColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
        highLineWidth: 1,
        lowLineWidth: 1,
        closeLineWidth: 1,
      });

      // Set data cho cả 2 series
      if (candlestickData.length > 0) {
        candlestickSeriesRef.current.setData(candlestickData);
      }
      if (hlcData.length > 0) {
        hlcSeriesRef.current.setData(hlcData);
      }

      // Fit content để hiển thị tất cả dữ liệu
      chartRef.current.timeScale().fitContent();
    }

    // Cleanup khi component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        hlcSeriesRef.current = null;
      }
    };
  }, []);

  // Update theme khi theme thay đổi
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          background: { 
            color: theme === 'dark' ? '#1f2937' : '#ffffff' 
          },
          textColor: theme === 'dark' ? '#f9fafb' : '#333',
        },
        grid: {
          vertLines: { 
            color: theme === 'dark' ? '#374151' : '#f0f0f0' 
          },
          horzLines: { 
            color: theme === 'dark' ? '#374151' : '#f0f0f0' 
          },
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
        },
      });
    }
  }, [theme]);

  // Update data khi data thay đổi
  useEffect(() => {
    if (chartRef.current) {
      // Update candlestick data
      if (candlestickData.length > 0 && candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(candlestickData);
      }
      
      // Update HLC data
      if (hlcData.length > 0 && hlcSeriesRef.current) {
        hlcSeriesRef.current.setData(hlcData);
      }
      
      chartRef.current.timeScale().fitContent();
    }
  }, [candlestickData, hlcData]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          400
        );
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
        {title}
      </h2>
      <div ref={chartContainerRef} className="chart-container" />
      <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Candlestick (Up)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Candlestick (Down)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>HLC High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>HLC Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>HLC Close</span>
        </div>
      </div>
    </div>
  );
} 