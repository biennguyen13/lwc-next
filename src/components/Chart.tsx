'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickData, HistogramData } from 'lightweight-charts';
import { useTheme } from './ThemeProvider';
import { HLCAreaSeries, HLCAreaData } from './HLCAreaSeries';
import { useBinance30sStore } from '@/stores';

// Types for socket data
interface KlineData {
  symbol: string;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
  trades: number;
  isClosed: boolean;
}

interface SocketData {
  type: string;
  data: KlineData;
  timestamp: string;
}

interface ChartProps {
  candlestickData: CandlestickData[];
  hlcData: HLCAreaData[];
  volumeData: HistogramData[];
  title?: string;
  preserveZoom?: boolean; // Thêm prop để control việc giữ zoom
  enableRealTime?: boolean; // Thêm prop để enable/disable real-time updates
  symbol?: string; // Thêm prop để filter symbol
}

const OFFSET = 30
const STEPS = 10
const expansionFactor = 0; // Mở rộng thêm 30%

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
  
  // Convert thành HLC format và chỉ lấy OFFSET items cuối cùng
  const allBollingerData = bollingerBands.map((band, index) => {
    // Tính toán khoảng cách giữa upper và lower band
    const bandWidth = band.upper - band.lower;
    const expansion = bandWidth * expansionFactor;
    
    return {
      time: candlestickData[index].time,
      high: band.upper + expansion,    // Upper band + expansion làm high
      low: band.lower - expansion,     // Lower band - expansion làm low  
      close: band.middle,              // Middle band (SMA) làm close
    };
  });
  
  // Chỉ trả về OFFSET items cuối cùng
  return allBollingerData.slice(-OFFSET);
};

let lastCandlestickData: CandlestickData | null = null;
let isUpdating = false; // Flag to prevent multiple simultaneous updates

export default function Chart({ 
  candlestickData, 
  hlcData, 
  volumeData, 
  title = 'Biểu đồ giá', 
  preserveZoom = false,
  enableRealTime = false,
  symbol = 'BTCUSDT'
}: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const hlcSeriesRef = useRef<any>(null);
  const visibleRangeRef = useRef<any>(null); // Lưu visible range hiện tại
  const volumeSeriesRef = useRef<any>(null);
  const ma5SeriesRef = useRef<any>(null);
  const ma15SeriesRef = useRef<any>(null);
  const ma10SeriesRef = useRef<any>(null);
  const { theme } = useTheme();
  const { fetchCandles } = useBinance30sStore();

  // Socket state
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    totalMessages: 0,
    lastMessageTime: null as string | null
  });
  const socketRef = useRef<any>(null);

  // Hover state
  const [hoverData, setHoverData] = useState<{
    time?: string;
    candlestick?: any;
    volume?: any;
  } | null>(null);

  // Convert KlineData to CandlestickData format with smooth animation
  const convertKlineToCandlestick = (kline: KlineData): { main: CandlestickData; smoothSteps: CandlestickData[] } => {
    // Convert kline.openTime to DateTime and adjust seconds
    const dateTime = new Date(kline.openTime);
    const seconds = dateTime.getSeconds();
    
    // Adjust seconds based on the logic:
    // - If seconds 0-29: set to 0
    // - If seconds 30-59: set to 30
    if (seconds >= 0 && seconds < 30) {
      dateTime.setSeconds(0);
    } else if (seconds >= 30 && seconds <= 59) {
      dateTime.setSeconds(30);
    }
    
    // Convert back to milliseconds and then to seconds for chart
    const adjustedTime = Math.floor(dateTime.getTime() / 1000);
    
    // If we have lastCandlestickData, combine with new data
    if (lastCandlestickData) {
      // Ensure the new time is not older than the last candlestick time
      const lastTime = typeof lastCandlestickData.time === 'number' ? lastCandlestickData.time : lastCandlestickData.time;
      const newTime = adjustedTime;
      
      // If new time is older than last time, use the last time + 1 second
      const finalTime = newTime >= lastTime ? newTime : lastTime + 1;
      
      lastCandlestickData.volume = (lastCandlestickData.volume || 0) + kline.volume;
      
      const targetData = {
        time: finalTime, // Use the validated time
        open: lastCandlestickData.open, // Keep open from lastCandlestickData
        close: kline.close, // Use close from new data
        high: Math.max(lastCandlestickData.high, kline.high), // Take the higher value
        low: Math.min(lastCandlestickData.low, kline.low), // Take the lower value
        volume: lastCandlestickData.volume, // Accumulate volume
      };

      // Create 10 smooth steps for animation
      const smoothSteps: CandlestickData[] = [];
      
      for (let i = 1; i <= STEPS; i++) {
        const progress = i / STEPS;
        
        // Interpolate values between lastCandlestickData and targetData
        const interpolatedData: CandlestickData = {
          time: targetData.time,
          open: targetData.open, // Keep open unchanged
          close: lastCandlestickData.close + (targetData.close - lastCandlestickData.close) * progress,
          high: lastCandlestickData.high + (targetData.high - lastCandlestickData.high) * progress,
          low: lastCandlestickData.low + (targetData.low - lastCandlestickData.low) * progress,
          volume: lastCandlestickData.volume + (targetData.volume - lastCandlestickData.volume) * progress,
        };
        
        smoothSteps.push(interpolatedData);
      }
      
      // Update lastCandlestickData with the new validated data
      lastCandlestickData = {
        ...targetData
      };
      
      return {
        main: targetData,
        smoothSteps: smoothSteps
      };
    }
    
    // If no lastCandlestickData, return original data with no smooth steps
    const originalData = {
      time: adjustedTime as any,
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close,
      volume: kline.volume,
    };
    
    // Update lastCandlestickData for future updates
    lastCandlestickData = { ...originalData };
    
    return {
      main: originalData,
      smoothSteps: [originalData] // Single step for new candle
    };
  };

  useEffect(() => {
    // Reset lastCandlestickData when new data comes from API
    // This ensures we don't have conflicts between API data and real-time updates
    if (candlestickData.length > 0) {
      const lastData = candlestickData[candlestickData.length - 1];
      lastCandlestickData = { ...lastData };
      console.log('🔄 Reset lastCandlestickData from API data:', JSON.stringify(lastCandlestickData, null, 2));
    }
  }, [candlestickData]);

  // Socket connection effect
  useEffect(() => {
    if (!enableRealTime) return;

    const initSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        
        socketRef.current = io(process.env.API_BASE_URL, {
          transports: ['websocket', 'polling']
        });

        socketRef.current.on('connect', () => {
          console.log('🔌 Chart: Connected to Socket.IO server');
          setIsSocketConnected(true);
        });

        socketRef.current.on('disconnect', (reason: string) => {
          console.log('🔌 Chart: Disconnected from Socket.IO server:', reason);
          setIsSocketConnected(false);
        });

        socketRef.current.on('kline-update', (data: SocketData) => {
          // console.log('📊 Chart: Received kline update:', data);
          
          // Filter by symbol if specified
          if (symbol && data.data.symbol !== symbol) {
            return;
          }

          setRealTimeStats(prev => ({
            ...prev,
            totalMessages: prev.totalMessages + 1,
            lastMessageTime: new Date().toISOString()
          }));

          // Check if timestamp has seconds 30 or 00 to trigger fetchCandles
          if (data.timestamp) {
            const timestamp = new Date(data.timestamp);
            const seconds = timestamp.getSeconds();
            
            if (seconds === 31 || seconds === 1) {
              console.log('🔄 Triggering fetchCandles at seconds:', seconds, 'for symbol:', symbol);
              fetchCandles({ 
                symbol: symbol || 'BTCUSDT', 
                limit: 150 
              });
            }else {
                    // Update chart with real-time data
              if (chartRef.current && candlestickSeriesRef.current && !isUpdating) {
                isUpdating = true; // Set flag to prevent multiple updates
                
                const { main: candleData, smoothSteps } = convertKlineToCandlestick(data.data);
                
                // Check if the new data timestamp is valid (not older than the last data point)
                try {
                  // Update volume if available
                  if (volumeSeriesRef.current) {
                    const volumeData = {
                      time: candleData.time,
                      value: candleData.volume,
                      color: candleData.close >= candleData.open ? '#26a69a' : '#ef5350',
                    };
                    // volumeSeriesRef.current.update(volumeData);
                  }
                  
                  // Animate through smooth steps only if the main update was successful
                  let stepIndex = 0;
                  const animateStep = () => {
                    if (stepIndex < smoothSteps.length) {
                      const stepData = smoothSteps[stepIndex];
                      
                      try {
                        candlestickSeriesRef.current.update(stepData);
                        
                        // Update volume if available
                        if (volumeSeriesRef.current) {
                          const volumeData = {
                            time: stepData.time,
                            value: stepData.volume,
                            color: stepData.close >= stepData.open ? '#26a69a' : '#ef5350',
                          };
                          volumeSeriesRef.current.update(volumeData);
                        }
                      } catch (stepError) {
                        // If step update fails, stop animation
                        console.warn('⚠️ Step animation update failed:', stepError);
                        return;
                      }
                      
                      stepIndex++;
                      // Schedule next step with small delay for smooth animation
                      setTimeout(animateStep, parseInt(1000 * 0.75 / STEPS));
                    }
                  };
                  
                  // Start animation
                  animateStep();

                  // Update MA lines if available
                  if (ma5SeriesRef.current || ma10SeriesRef.current || ma15SeriesRef.current) {
                    // For real-time updates, we need to get all current data and recalculate
                    // This is a simplified approach - in production you might want to maintain a data buffer
                    // console.log('📊 Updating MA lines for real-time data');
                  }
                } catch (updateError) {
                  // If the main update fails, it means the timestamp is invalid
                  console.warn('⚠️ Real-time update failed - invalid timestamp:', updateError);
                  console.log('📊 Candle data that failed:', candleData);
                  
                  // Optionally, you can trigger a full data refresh here
                  // fetchCandles({ symbol: symbol || 'BTCUSDT', limit: 150 });
                } finally {
                  // Reset the updating flag after a short delay to allow for smooth animations
                  setTimeout(() => {
                    isUpdating = false;
                  }, 100);
                }
              }
            }
          }

    
        });

        socketRef.current.on('connect_error', (error: any) => {
          console.error('❌ Chart: Socket.IO connection error:', error);
          setIsSocketConnected(false);
        });

      } catch (error) {
        console.error('❌ Chart: Failed to initialize socket:', error);
      }
    };

    initSocket();

    // Cleanup socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [enableRealTime, symbol]);

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

      // Subscribe to chart crosshair move events (for all series)
      chartRef.current.subscribeCrosshairMove((param) => {
        if (param.time && param.seriesData) {
          const candlestickData = param.seriesData.get(candlestickSeriesRef.current);
          const volumeData = param.seriesData.get(volumeSeriesRef.current);
          
          if (candlestickData || volumeData) {
            const hoverInfo: any = {
              time: new Date(param.time * 1000).toLocaleString(),
            };
            
            if (candlestickData) {
              hoverInfo.candlestick = {
                open: candlestickData.open,
                high: candlestickData.high,
                low: candlestickData.low,
                close: candlestickData.close,
                volume: candlestickData.volume
              };
              // console.log('🕯️ Candlestick Hover:', hoverInfo);
            }
            
            if (volumeData) {
              hoverInfo.volume = {
                value: volumeData.value,
                color: volumeData.color
              };
              // console.log('📊 Volume Hover:', hoverInfo);
            }
            
            setHoverData(hoverInfo);
          }
        }
      });

      // Thêm HLC Area series
      const customSeriesView = new HLCAreaSeries();
      
      // Sử dụng cùng màu cho tất cả (orange theme)
      const bollingerColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.8)';
      const bollingerAreaColor = theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.2)';
      
      hlcSeriesRef.current = chartRef.current.addCustomSeries(customSeriesView, {
        highLineColor: bollingerAreaColor,      // Upper band
        lowLineColor: bollingerAreaColor,       // Lower band
        closeLineColor: 'transparent',     // Middle band
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

      // Thêm MA15 series
      ma15SeriesRef.current = chartRef.current.addLineSeries({
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

      // Thêm MA5 series
      ma5SeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? '#a84bff' : '#a84bff', // Purple
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
          closeLineColor: 'transparent',
          areaBottomColor: bollingerAreaColor,
          areaTopColor: bollingerAreaColor,
        });
      }

      // Update MA series colors theo theme
      if (ma15SeriesRef.current) {
        ma15SeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#10b981' : '#059669', // Green
        });
      }

      if (ma10SeriesRef.current) {
        ma10SeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#f59e0b' : '#d97706', // Orange
        });
      }

      if (ma5SeriesRef.current) {
        ma5SeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#a84bff' : '#a84bff', // Purple
        });
      }

      // Update volume series color theo theme
      if (volumeSeriesRef.current) {
        volumeSeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#3b82f6' : '#2563eb',
        });
      }

      // Set data cho tất cả series - chỉ lấy OFFSET items cuối cùng
      if (candlestickData.length > 0) {
        const last150Candlestick = candlestickData.slice(-OFFSET);
        // console.log('📊 Setting candlestick data:', last150Candlestick.length, 'items');
        candlestickSeriesRef.current.setData(last150Candlestick);
        
        // Tính toán và set MA data
        const ma5Data = calculateMA(candlestickData, 5);
        const ma15Data = calculateMA(candlestickData, 15);
        const ma10Data = calculateMA(candlestickData, 10);
        
        const last150MA5 = ma5Data.slice(-OFFSET);
        const last150MA15 = ma15Data.slice(-OFFSET);
        const last150MA10 = ma10Data.slice(-OFFSET);
        
        // console.log('📊 Setting MA5 data:', last150MA5.length, 'items');
        // console.log('📊 Setting MA15 data:', last150MA15.length, 'items');
        // console.log('📊 Setting MA10 data:', last150MA10.length, 'items');
        ma5SeriesRef.current.setData(last150MA5);
        ma15SeriesRef.current.setData(last150MA15);
        ma10SeriesRef.current.setData(last150MA10);
      }
      
      // Xử lý HLC data - nếu có hlcData thì dùng, không thì convert từ candlestick
      let finalHLCData = hlcData;
      if (hlcData.length === 0 && candlestickData.length > 0) {
        // Convert candlestick thành bollinger data
        finalHLCData = convertCandlestickToBollinger(candlestickData);
      }
      
      if (finalHLCData.length > 0) {
        // console.log('📊 Setting HLC data:', finalHLCData.length, 'items');
        hlcSeriesRef.current.setData(finalHLCData);
      }
      
      if (volumeData.length > 0) {
        const last150Volume = volumeData.slice(-OFFSET);
        volumeSeriesRef.current.setData(last150Volume);
      }

      // Lưu visible range hiện tại trước khi update data
      if (preserveZoom && chartRef.current) {
        const currentVisibleRange = chartRef.current.timeScale().getVisibleRange();
        if (currentVisibleRange) {
          visibleRangeRef.current = currentVisibleRange;
        }
      }

      // Fit content để hiển thị tất cả dữ liệu (chỉ khi không preserve zoom)
      if (!preserveZoom) {
        chartRef.current.timeScale().fitContent();
      }
      
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

      // Khôi phục visible range sau khi set data (nếu preserve zoom)
      if (preserveZoom && visibleRangeRef.current && chartRef.current) {
        chartRef.current.timeScale().setVisibleRange(visibleRangeRef.current);
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
        ma5SeriesRef.current = null;
        ma15SeriesRef.current = null;
        ma10SeriesRef.current = null;
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
      
      {/* Real-time Status */}
      {enableRealTime && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    isSocketConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Real-time: {isSocketConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {isSocketConnected && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Messages: {realTimeStats.totalMessages}
                </div>
              )}
            </div>
            {realTimeStats.lastMessageTime && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last update: {new Date(realTimeStats.lastMessageTime).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div ref={chartContainerRef} className="chart-container" />
      
      {/* Hover Info Display */}
      {hoverData && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">
              📊 Hover Info - {hoverData.time}
            </div>
            {hoverData.candlestick && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Open:</span>
                  <span className="font-mono text-green-600">{hoverData.candlestick.open?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">High:</span>
                  <span className="font-mono text-green-600">{hoverData.candlestick.high?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Low:</span>
                  <span className="font-mono text-red-600">{hoverData.candlestick.low?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Close:</span>
                  <span className="font-mono text-blue-600">{hoverData.candlestick.close?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                  <span className="font-mono text-purple-600">{hoverData.candlestick.volume?.toFixed(4)}</span>
                </div>
              </div>
            )}
            {hoverData.volume && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                <span className="font-mono text-purple-600">{hoverData.volume.value?.toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
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
          <span>MA15</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-600"></div>
          <span>MA5</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Volume</span>
        </div>
        {enableRealTime && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
            <span>Real-time Updates</span>
          </div>
        )}
      </div>
    </div>
  );
} 