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

// Hàm tính toán Bollinger Bands
const calculateBollingerBands = (data: CandlestickData[], period: number = 20, multiplier: number = 2) => {
  const bands: { upper: number; middle: number; lower: number }[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // Chưa đủ data để tính, set giá trị mặc định
      bands.push({ upper: 0, middle: 0, lower: 0 });
      continue;
    }
    
    // Lấy slice data để tính SMA
    const slice = data.slice(i - period + 1, i + 1);
    
    // Tính Simple Moving Average (SMA)
    const sma = slice.reduce((sum, item) => sum + item.close, 0) / period;
    
    // Tính Standard Deviation
    const variance = slice.reduce((sum, item) => sum + Math.pow(item.close - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    // Tính Bollinger Bands
    bands.push({
      upper: sma + (multiplier * stdDev),  // Upper Band
      middle: sma,                          // Middle Band (SMA)
      lower: sma - (multiplier * stdDev),  // Lower Band
    });
  }
  
  return bands;
};

// Hàm convert candlestick data thành bollinger data format
const convertCandlestickToBollinger = (candlestickData: CandlestickData[]): HLCAreaData[] => {
  if (candlestickData.length === 0) return [];
  
  // Tính toán Bollinger Bands
  const bollingerBands = calculateBollingerBands(candlestickData, 10, 2);
  // Convert thành HLC format
  return bollingerBands.map((band, index) => ({
    time: candlestickData[index].time,
    high: band.upper,    // Upper band làm high
    low: band.lower,     // Lower band làm low  
    close: band.middle,  // Middle band (SMA) làm close
  }));
};

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
      
      // Xử lý HLC data - nếu có hlcData thì dùng, không thì convert từ candlestick
      let finalHLCData = hlcData;
      if (hlcData.length === 0 && candlestickData.length > 0) {
        // Convert candlestick thành bollinger data
        finalHLCData = convertCandlestickToBollinger(candlestickData);
      }
      
      if (finalHLCData.length > 0) {
        hlcSeriesRef.current.setData(finalHLCData);
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

      // Update HLC series colors theo theme
      if (hlcSeriesRef.current) {
        const bollingerColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.8)';
        const bollingerAreaColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.2)';
        hlcSeriesRef.current.applyOptions({
          highLineColor: bollingerColor,
          lowLineColor: bollingerColor,
          closeLineColor: bollingerColor,
          areaBottomColor: bollingerAreaColor,
          areaTopColor: bollingerAreaColor,
        });
      }

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
      
      // Update HLC data - xử lý logic convert
      if (hlcSeriesRef.current) {
        let finalHLCData = hlcData;
        if (hlcData.length === 0 && candlestickData.length > 0) {
          // Convert candlestick thành bollinger data
          finalHLCData = convertCandlestickToBollinger(candlestickData);
        }
        
        if (finalHLCData.length > 0) {
          console.log(finalHLCData)
          hlcSeriesRef.current.setData(finalHLCData);
        }
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
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Upper Band</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Lower Band</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Middle Band (SMA)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Volume</span>
        </div>
      </div>
    </div>
  );
} 