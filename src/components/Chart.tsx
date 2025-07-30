'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, CandlestickData, HistogramData } from 'lightweight-charts';
import { useTheme } from './ThemeProvider';
import { HLCAreaSeries, HLCAreaData } from './HLCAreaSeries';

interface ChartProps {
  candlestickData: CandlestickData[];
  hlcData: HLCAreaData[];
  volumeData: HistogramData[];
  title?: string;
}

export default function Chart({ candlestickData, hlcData, volumeData, title = 'Biểu đồ giá' }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const hlcSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
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
      
      // Sử dụng cùng màu cho tất cả (orange theme)
      const bollingerColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.8)';
      const bollingerAreaColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.2)';
      
      hlcSeriesRef.current = chartRef.current.addCustomSeries(customSeriesView, {
        highLineColor: bollingerColor,      // Upper band
        lowLineColor: bollingerColor,       // Lower band
        closeLineColor: bollingerColor,     // Middle band
        areaBottomColor: bollingerAreaColor, // Area fill
        areaTopColor: bollingerAreaColor,   // Area fill
        highLineWidth: 2,
        lowLineWidth: 2,
        closeLineWidth: 2,
      });

      // Thêm volume histogram series
      volumeSeriesRef.current = chartRef.current.addHistogramSeries({
        color: theme === 'dark' ? '#3b82f6' : '#2563eb',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Tạo price scale riêng cho volume
        title: 'Volume',
      });

      // Tạo price scale riêng cho volume
      chartRef.current.priceScale('').applyOptions({
        scaleMargins: {
          top: 0.8, // Volume ở dưới 20% của chart
          bottom: 0,
        },
      });

      // Set data cho tất cả series
      if (candlestickData.length > 0) {
        candlestickSeriesRef.current.setData(candlestickData);
      }
      if (hlcData.length > 0) {
        hlcSeriesRef.current.setData(hlcData);
      }
      if (volumeData.length > 0) {
        volumeSeriesRef.current.setData(volumeData);
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
        volumeSeriesRef.current = null;
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

      // Update volume series color theo theme
      if (volumeSeriesRef.current) {
        volumeSeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#3b82f6' : '#2563eb',
        });
      }
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

      // Update volume data
      if (volumeData.length > 0 && volumeSeriesRef.current) {
        volumeSeriesRef.current.setData(volumeData);
      }
      
      chartRef.current.timeScale().fitContent();
    }
  }, [candlestickData, hlcData, volumeData]);

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
      <div className="mt-4 flex justify-center space-x-3 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
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
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Volume</span>
        </div>
      </div>
    </div>
  );
} 