'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { useTheme } from './ThemeProvider';

// Interface cho HLCAreaData
interface HLCAreaData {
  time: string | number;
  high: number;
  low: number;
  close: number;
}

// HLCAreaSeries class (simplified version)
class HLCAreaSeries {
  renderer() {
    return {
      draw: () => {},
      update: () => {},
    };
  }

  priceValueBuilder(data: HLCAreaData) {
    return [data.low, data.high, data.close];
  }

  isWhitespace(data: any) {
    return data.close === undefined;
  }

  update() {}

  defaultOptions() {
    return {
      highLineColor: 'rgba(242, 54, 69, 0.2)',
      lowLineColor: 'rgba(242, 54, 69, 0.2)',
      closeLineColor: 'rgba(242, 54, 69, 0.2)',
      areaBottomColor: 'rgba(242, 54, 69, 0.2)',
      areaTopColor: 'rgba(242, 54, 69, 0.2)',
      highLineWidth: 2,
      lowLineWidth: 2,
      closeLineWidth: 2,
    };
  }
}

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

      // Thêm custom series
      const customSeriesView = new HLCAreaSeries();
      const myCustomSeries = chartRef.current.addCustomSeries(customSeriesView, {
        highLineColor: 'rgba(242, 54, 69, 0.8)',
        lowLineColor: 'rgba(242, 54, 69, 0.8)',
        closeLineColor: 'rgba(242, 54, 69, 0.8)',
        areaBottomColor: 'rgba(242, 54, 69, 0.2)',
        areaTopColor: 'rgba(242, 54, 69, 0.2)',
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
    </div>
  );
} 