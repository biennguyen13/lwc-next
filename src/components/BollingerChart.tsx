'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { useTheme } from './ThemeProvider';
import { HLCAreaData } from './HLCAreaSeries';

interface BollingerChartProps {
  hlcData: HLCAreaData[];
  title?: string;
}

// Bollinger Bands calculation
const calculateBollingerBands = (data: HLCAreaData[], period: number = 20, multiplier: number = 2) => {
  const bands: { upper: number; middle: number; lower: number }[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      bands.push({ upper: 0, middle: 0, lower: 0 });
      continue;
    }
    
    // Tính SMA (Simple Moving Average) sử dụng close price
    const slice = data.slice(i - period + 1, i + 1);
    const sma = slice.reduce((sum, item) => sum + item.close, 0) / period;
    
    // Tính Standard Deviation
    const variance = slice.reduce((sum, item) => sum + Math.pow(item.close - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    bands.push({
      upper: sma + (multiplier * stdDev),
      middle: sma,
      lower: sma - (multiplier * stdDev)
    });
  }
  
  return bands;
};

export default function BollingerChart({ hlcData, title = 'Bollinger Bands Chart' }: BollingerChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const hlcSeriesRef = useRef<any>(null);
  const upperBandSeriesRef = useRef<any>(null);
  const middleBandSeriesRef = useRef<any>(null);
  const lowerBandSeriesRef = useRef<any>(null);
  const bollingerAreaSeriesRef = useRef<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      // Tạo chart với theme
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500, // Tăng height cho Bollinger chart
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

      // Thêm HLC Area series (chỉ để tham khảo)
      const { HLCAreaSeries } = require('./HLCAreaSeries');
      const customSeriesView = new HLCAreaSeries();
      hlcSeriesRef.current = chartRef.current.addCustomSeries(customSeriesView, {
        highLineColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(220, 38, 38, 0.4)',
        lowLineColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.4)',
        closeLineColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.4)',
        areaBottomColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(220, 38, 38, 0.05)',
        areaTopColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(5, 150, 105, 0.05)',
        highLineWidth: 1,
        lowLineWidth: 1,
        closeLineWidth: 1,
      });

      // Thêm Bollinger Bands Area (fill màu)
      bollingerAreaSeriesRef.current = chartRef.current.addAreaSeries({
        topColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.15)',
        bottomColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(217, 119, 6, 0.08)',
        lineColor: 'transparent',
        lineWidth: 0,
        title: 'Bollinger Bands Area',
      });

      // Thêm Bollinger Bands Lines
      const bollingerBands = calculateBollingerBands(hlcData, 20, 2);
      
      upperBandSeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? '#f59e0b' : '#d97706',
        lineWidth: 2,
        lineStyle: 1, // Dashed line
        title: 'Upper Band',
      });

      middleBandSeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? '#8b5cf6' : '#7c3aed',
        lineWidth: 2,
        title: 'Middle Band (SMA)',
      });

      lowerBandSeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? '#f59e0b' : '#d97706',
        lineWidth: 2,
        lineStyle: 1, // Dashed line
        title: 'Lower Band',
      });

      // Set data cho tất cả series
      if (hlcData.length > 0) {
        hlcSeriesRef.current.setData(hlcData);
      }

      // Set Bollinger Bands data
      const upperBandData = bollingerBands.map((band, index) => ({
        time: hlcData[index].time,
        value: band.upper,
      })).filter(item => item.value > 0);

      const middleBandData = bollingerBands.map((band, index) => ({
        time: hlcData[index].time,
        value: band.middle,
      })).filter(item => item.value > 0);

      const lowerBandData = bollingerBands.map((band, index) => ({
        time: hlcData[index].time,
        value: band.lower,
      })).filter(item => item.value > 0);

      // Set Bollinger Bands Area data
      const bollingerAreaData = bollingerBands.map((band, index) => ({
        time: hlcData[index].time,
        value: band.upper,
      })).filter(item => item.value > 0);

      upperBandSeriesRef.current.setData(upperBandData);
      middleBandSeriesRef.current.setData(middleBandData);
      lowerBandSeriesRef.current.setData(lowerBandData);
      bollingerAreaSeriesRef.current.setData(bollingerAreaData);

      // Fit content để hiển thị tất cả dữ liệu
      chartRef.current.timeScale().fitContent();
    }

    // Cleanup khi component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        hlcSeriesRef.current = null;
        upperBandSeriesRef.current = null;
        middleBandSeriesRef.current = null;
        lowerBandSeriesRef.current = null;
        bollingerAreaSeriesRef.current = null;
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

      // Update HLC series colors theo theme
      if (hlcSeriesRef.current) {
        hlcSeriesRef.current.applyOptions({
          highLineColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(220, 38, 38, 0.4)',
          lowLineColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.4)',
          closeLineColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.4)',
          areaBottomColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(220, 38, 38, 0.05)',
          areaTopColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(5, 150, 105, 0.05)',
        });
      }

      // Update Bollinger Bands colors theo theme
      if (upperBandSeriesRef.current) {
        upperBandSeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#f59e0b' : '#d97706',
        });
      }
      if (middleBandSeriesRef.current) {
        middleBandSeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#8b5cf6' : '#7c3aed',
        });
      }
      if (lowerBandSeriesRef.current) {
        lowerBandSeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#f59e0b' : '#d97706',
        });
      }

      // Update Bollinger Area colors theo theme
      if (bollingerAreaSeriesRef.current) {
        bollingerAreaSeriesRef.current.applyOptions({
          topColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.15)',
          bottomColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(217, 119, 6, 0.08)',
        });
      }
    }
  }, [theme]);

  // Update data khi data thay đổi
  useEffect(() => {
    if (chartRef.current) {
      // Update HLC data
      if (hlcData.length > 0 && hlcSeriesRef.current) {
        hlcSeriesRef.current.setData(hlcData);
      }

      // Update Bollinger Bands
      if (hlcData.length > 0) {
        const bollingerBands = calculateBollingerBands(hlcData, 20, 2);
        
        const upperBandData = bollingerBands.map((band, index) => ({
          time: hlcData[index].time,
          value: band.upper,
        })).filter(item => item.value > 0);

        const middleBandData = bollingerBands.map((band, index) => ({
          time: hlcData[index].time,
          value: band.middle,
        })).filter(item => item.value > 0);

        const lowerBandData = bollingerBands.map((band, index) => ({
          time: hlcData[index].time,
          value: band.lower,
        })).filter(item => item.value > 0);

        // Update Bollinger Area data
        const bollingerAreaData = bollingerBands.map((band, index) => ({
          time: hlcData[index].time,
          value: band.upper,
        })).filter(item => item.value > 0);

        if (upperBandSeriesRef.current) {
          upperBandSeriesRef.current.setData(upperBandData);
        }
        if (middleBandSeriesRef.current) {
          middleBandSeriesRef.current.setData(middleBandData);
        }
        if (lowerBandSeriesRef.current) {
          lowerBandSeriesRef.current.setData(lowerBandData);
        }
        if (bollingerAreaSeriesRef.current) {
          bollingerAreaSeriesRef.current.setData(bollingerAreaData);
        }
      }
      
      chartRef.current.timeScale().fitContent();
    }
  }, [hlcData]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          500
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
      <div ref={chartContainerRef} className="chart-container" style={{ height: '500px' }} />
      <div className="mt-4 flex justify-center space-x-3 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-40"></div>
          <span>HLC High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 opacity-40"></div>
          <span>HLC Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-40"></div>
          <span>HLC Close</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Upper Band</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Middle Band (SMA)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Lower Band</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-200 rounded"></div>
          <span>Bollinger Area</span>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p><strong>Bollinger Bands Analysis:</strong></p>
        <p>• Vùng rộng = High volatility</p>
        <p>• Vùng hẹp = Low volatility (squeeze)</p>
        <p>• Price outside bands = Overbought/Oversold</p>
        <p>• Middle band = 20-period SMA</p>
      </div>
    </div>
  );
} 