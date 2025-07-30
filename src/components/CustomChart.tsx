'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { useTheme } from './ThemeProvider';
import { HLCAreaSeries, HLCAreaData, HLCAreaSeriesOptions } from './HLCAreaSeries';

interface CustomChartProps {
  data: HLCAreaData[];
  title?: string;
}

export default function CustomChart({ data, title = 'HLC Area Chart' }: CustomChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
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

      // Thêm custom HLC Area series
      const customSeriesView = new HLCAreaSeries();
      const myCustomSeries = chartRef.current.addCustomSeries(customSeriesView, {
        highLineColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(220, 38, 38, 0.8)',
        lowLineColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)',
        closeLineColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(5, 150, 105, 0.8)',
        areaBottomColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
        areaTopColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
        highLineWidth: 2,
        lowLineWidth: 2,
        closeLineWidth: 2,
      });

      myCustomSeries.setData(data);

      // Fit content
      chartRef.current.timeScale().fitContent();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
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
      <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Close</span>
        </div>
      </div>
    </div>
  );
} 