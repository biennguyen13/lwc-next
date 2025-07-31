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

// Hàm tính toán Moving Average
const calculateMA = (data: CandlestickData[], period: number) => {
  const maData: { time: any; value: number }[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // Chưa đủ data để tính, set giá trị mặc định
      maData.push({ time: data[i].time, value: 0 });
      continue;
    }
    
    // Lấy slice data để tính SMA
    const slice = data.slice(i - period + 1, i + 1);
    
    // Tính Simple Moving Average (SMA)
    const sma = slice.reduce((sum, item) => sum + item.close, 0) / period;
    
    maData.push({ time: data[i].time, value: sma });
  }
  
  return maData;
};

// Hàm convert candlestick data thành bollinger data format
const convertCandlestickToBollinger = (candlestickData: CandlestickData[]): HLCAreaData[] => {
  if (candlestickData.length === 0) return [];
  
  // Tính toán Bollinger Bands từ toàn bộ data (200 items)
  const bollingerBands = calculateBollingerBands(candlestickData, 10, 2);
  
  // Convert thành HLC format và chỉ lấy 150 items cuối cùng
  const allBollingerData = bollingerBands.map((band, index) => {
    // Tính toán khoảng cách giữa upper và lower band
    const bandWidth = band.upper - band.lower;
    const expansionFactor = 0.3; // Mở rộng thêm 30%
    const expansion = bandWidth * expansionFactor;
    
    return {
      time: candlestickData[index].time,
      high: band.upper + expansion,    // Upper band + expansion làm high
      low: band.lower - expansion,     // Lower band - expansion làm low  
      close: band.middle,              // Middle band (SMA) làm close
    };
  });
  
  // Chỉ trả về 150 items cuối cùng
  return allBollingerData.slice(-150);
};

export default function Chart({ candlestickData, hlcData, volumeData, title = 'Biểu đồ giá' }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const hlcSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const ma7SeriesRef = useRef<any>(null);
  const ma10SeriesRef = useRef<any>(null);
  const ma25SeriesRef = useRef<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      // Tạo chart với theme
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 700, // Tăng từ 400 lên 600
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
          mode: 0, // Tắt crosshair để bỏ các đường ngang và label
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
          scaleMargins: {
            top: 0.1, // Giảm margin top
            bottom: 0.1, // Giảm margin bottom
          },
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
          timeVisible: true,
          secondsVisible: false,
        },
        // Thêm options để tối ưu không gian
        overlayPriceScales: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        // Disable zoom và pan
        handleScroll: {
          mouseWheel: false, // Disable mouse wheel zoom
          pressedMouseMove: false, // Disable drag zoom
          horzTouchDrag: false, // Disable kéo ngang
          vertTouchDrag: false, // Disable kéo dọc
        },
        handleScale: {
          axisPressedMouseMove: false, // Disable axis drag zoom
          mouseWheel: false, // Disable mouse wheel zoom
          pinch: false, // Disable pinch zoom
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
        title: '',
        priceLineVisible: true,
        lastValueVisible: true,
      });

      // Thêm HLC Area series
      const customSeriesView = new HLCAreaSeries();
      
      // Sử dụng cùng màu cho tất cả (orange theme)
      const bollingerColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.8)';
      const bollingerAreaColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.2)';
      
      hlcSeriesRef.current = chartRef.current.addCustomSeries(customSeriesView, {
        highLineColor: bollingerAreaColor,      // Upper band
        lowLineColor: bollingerAreaColor,       // Lower band
        closeLineColor: bollingerAreaColor,     // Middle band
        areaBottomColor: bollingerAreaColor, // Area fill
        areaTopColor: bollingerAreaColor,   // Area fill
        highLineWidth: 2,
        lowLineWidth: 2,
        closeLineWidth: 2,
        title: '',
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // Thêm volume histogram series
      volumeSeriesRef.current = chartRef.current.addHistogramSeries({
        color: theme === 'dark' ? '#3b82f6' : '#2563eb',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Tạo price scale riêng cho volume
        title: '',
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // Tạo price scale riêng cho volume
      chartRef.current.priceScale('').applyOptions({
        scaleMargins: {
          top: 0.8, // Volume ở dưới 20% của chart
          bottom: 0,
        },
      });

      // Thêm MA7 series
      ma7SeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? '#10b981' : '#059669', // Green
        lineWidth: 2,
        title: '',
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // Thêm MA10 series
      ma10SeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? '#f59e0b' : '#d97706', // Orange
        lineWidth: 2,
        title: '',
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // Thêm MA25 series
      ma25SeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? 'purple' : 'purple', // Purple
        lineWidth: 2,
        title: '',
        priceLineVisible: false,
        lastValueVisible: false,
      });
    }

    // Set data và update theme chỉ khi chart đã được tạo
    if (chartRef.current) {
      // Update theme
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
          highLineColor: bollingerAreaColor,
          lowLineColor: bollingerAreaColor,
          closeLineColor: bollingerAreaColor,
          areaBottomColor: bollingerAreaColor,
          areaTopColor: bollingerAreaColor,
        });
      }

      // Update MA series colors theo theme
      if (ma7SeriesRef.current) {
        ma7SeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#10b981' : '#059669', // Green
        });
      }

      if (ma10SeriesRef.current) {
        ma10SeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#f59e0b' : '#d97706', // Orange
        });
      }

      if (ma25SeriesRef.current) {
        ma25SeriesRef.current.applyOptions({
          color: theme === 'dark' ? 'purple' : 'purple', // Purple
        });
      }

      // Update volume series color theo theme
      if (volumeSeriesRef.current) {
        volumeSeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#3b82f6' : '#2563eb',
        });
      }

      // Set data cho tất cả series - chỉ lấy 150 items cuối cùng
      if (candlestickData.length > 0) {
        const last150Candlestick = candlestickData.slice(-150);
        console.log('📊 Setting candlestick data:', last150Candlestick.length, 'items');
        candlestickSeriesRef.current.setData(last150Candlestick);
        
        // Tính toán và set MA data
        const ma7Data = calculateMA(candlestickData, 7);
        const ma10Data = calculateMA(candlestickData, 10);
        const ma25Data = calculateMA(candlestickData, 25);
        
        const last150MA7 = ma7Data.slice(-150);
        const last150MA10 = ma10Data.slice(-150);
        const last150MA25 = ma25Data.slice(-150);
        
        console.log('📊 Setting MA7 data:', last150MA7.length, 'items');
        console.log('📊 Setting MA10 data:', last150MA10.length, 'items');
        console.log('📊 Setting MA25 data:', last150MA25.length, 'items');
        ma7SeriesRef.current.setData(last150MA7);
        ma10SeriesRef.current.setData(last150MA10);
        ma25SeriesRef.current.setData(last150MA25);
      }
      
      // Xử lý HLC data - nếu có hlcData thì dùng, không thì convert từ candlestick
      let finalHLCData = hlcData;
      if (hlcData.length === 0 && candlestickData.length > 0) {
        // Convert candlestick thành bollinger data
        finalHLCData = convertCandlestickToBollinger(candlestickData);
      }
      
      if (finalHLCData.length > 0) {
        console.log('📊 Setting HLC data:', finalHLCData.length, 'items');
        hlcSeriesRef.current.setData(finalHLCData);
      }
      
      if (volumeData.length > 0) {
        const last150Volume = volumeData.slice(-150);
        volumeSeriesRef.current.setData(last150Volume);
      }

      // Fit content để hiển thị tất cả dữ liệu
      chartRef.current.timeScale().fitContent();
      
      // Tối ưu price scale để loại bỏ khoảng trống
      if (candlestickData.length > 0) {
        const prices = candlestickData.map(item => [item.high, item.low]).flat();
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = maxPrice - minPrice;
        const padding = priceRange * 0.05; // 5% padding
        
        chartRef.current.priceScale('right').applyOptions({
          autoScale: false,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
          minValue: minPrice - padding,
          maxValue: maxPrice + padding,
        });
      }
    }

    // Cleanup khi component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        hlcSeriesRef.current = null;
        volumeSeriesRef.current = null;
        ma7SeriesRef.current = null;
        ma10SeriesRef.current = null;
        ma25SeriesRef.current = null;
      }
    };
  }, [theme, candlestickData, hlcData, volumeData]); // Thêm dependency

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          700 // Tăng từ 400 lên 600
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
          <div className="w-3 h-3 rounded-full bg-green-600"></div>
          <span>MA7</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-600"></div>
          <span>MA25</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Volume</span>
        </div>
      </div>
    </div>
  );
} 