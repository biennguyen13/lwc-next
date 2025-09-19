'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, CandlestickData, HistogramData, LineStyle } from 'lightweight-charts';
import { useTheme } from './ThemeProvider';
import { HLCAreaSeries, HLCAreaData } from './HLCAreaSeries';
import { useBinance30sStore } from '@/stores';
import { SocketKlineMessage, BinanceCandle } from '@/lib/api/binance-30s';
import { io } from 'socket.io-client';
import { useActiveOrders } from '@/contexts/ActiveOrdersContext';

// Types for socket data (legacy - keeping for backward compatibility)
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
  second: number;
  is_bet: boolean;
}

interface ChartProps {
  candlestickData: CandlestickData[];
  hlcData: HLCAreaData[];
  volumeData: HistogramData[];
  preserveZoom?: boolean; // Thêm prop để control việc giữ zoom
  enableRealTime?: boolean; // Thêm prop để enable/disable real-time updates
  symbol?: string; // Thêm prop để filter symbol
  // Candle configuration props
  candleWidth?: number; // Width of each candle in pixels (default: 5)
  candleSpacing?: number; // Spacing between candles in pixels (default: 2)
  chartMargins?: number; // Chart margins for price/time scales (default: 100)
  minCandles?: number; // Minimum number of candles to show (default: 20)
  maxCandles?: number; // Maximum number of candles to show (default: 200)
  // Grid configuration
  horizontalGridStyle?: number; // 0 = solid, 1 = dotted, 2 = dashed (default: 1)
  horizontalGridColor?: string; // Custom color for horizontal grid lines
  gridDensity?: 'low' | 'medium' | 'high'; // Grid density: low = thưa, high = dày (default: 'medium')
  // Background configuration
  backgroundTransparent?: boolean; // Set background to transparent (default: true)
  backgroundColor?: string; // Custom background color (overrides transparent)
}

const STEPS = 10
const expansionFactor = 0; // Mở rộng thêm 30%

// Function to calculate dynamic chart height based on browser viewport
const getChartHeight = (): number => {
  const viewportHeight = window.innerHeight;
  const isMobile = window.innerWidth < 767.99;
  const heightRatio = isMobile ? 1 : 0.66; // 50% for mobile, 66% for desktop
  const calculatedHeight = (viewportHeight * heightRatio) - (isMobile ? 277 + 65 + 30 : 0);
  const maxHeight = calculatedHeight;
  const minHeight = 350;
  
  return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
};

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

// Hàm tạo fake data để mở rộng trục ngang
const generateFakeData = (candlestickData: CandlestickData[], numberOfItems: number = 1) => {
  if (candlestickData.length === 0) return [];
  
  const fakeData: { time: any; value: number }[] = [];
  
  // Lấy item cuối cùng của candlestickData
  const lastItem = candlestickData[candlestickData.length - 1];
  
  // Tạo nhiều item fake với time tăng dần 30 giây mỗi item
  for (let i = 1; i <= numberOfItems; i++) {
    const fakeItem = {
      time: lastItem.time + (30 * i), // Cộng thêm 30 * i giây
      value: lastItem.close // Sử dụng giá close của item cuối cùng
    };
    
    fakeData.push(fakeItem);
  }
  
  return fakeData;
};



let lastCandlestickData: CandlestickData | null = null;
let isUpdating = false; // Flag to prevent multiple simultaneous updates

export default function Chart({ 
  candlestickData, 
  hlcData, 
  volumeData, 
  preserveZoom = false,
  enableRealTime = true,
  symbol = 'BTCUSDT',
  // Candle configuration with defaults
  candleWidth = 5,
  candleSpacing = 2,
  chartMargins = 100,
  minCandles = 20,
  maxCandles = 200,
  // Grid configuration with defaults
  horizontalGridStyle = 1,
  horizontalGridColor,
  gridDensity = 'low',
  // Background configuration with defaults
  backgroundTransparent = true,
  backgroundColor,
  limit = 150
}: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const hlcSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const ma5SeriesRef = useRef<any>(null);
  
  // Get active orders context
  const { isActiveOrdersOpen } = useActiveOrders();
  const ma15SeriesRef = useRef<any>(null);
  const ma10SeriesRef = useRef<any>(null);
  const fakeSeriesRef = useRef<any>(null); // Thêm ref cho fake series
  const { theme } = useTheme();
  const { fetchCandles, fetchCandleTables, handleSocketMessage } = useBinance30sStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // State for dynamic offset
  const [currentOffset, setCurrentOffset] = useState(175);
  const [containerWidth, setContainerWidth] = useState(0);

  // Get background configuration
  const getBackgroundConfig = () => {
    if (backgroundColor) {
      return {
        type: 'solid' as const,
        color: backgroundColor
      };
    }
    
    if (backgroundTransparent) {
      return {
        type: 'solid' as const,
        color: 'transparent'
      };
    }
    
    // Default theme-based background
    return {
      type: 'solid' as const,
      color: theme === 'dark' ? '#1f2937' : '#ffffff'
    };
  };

  // Get grid configuration based on density
  const getGridConfig = () => {
    switch (gridDensity) {
      case 'low':
        return {
          ticksVisible: false,
          borderVisible: false,
          autoScale: true,
          scaleMargins: { top: 0.1, bottom: 0.1 }
        };
      case 'high':
        return {
          ticksVisible: true,
          borderVisible: true,
          autoScale: true,
          scaleMargins: { top: 0.05, bottom: 0.05 }
        };
      default: // medium
        return {
          ticksVisible: false,
          borderVisible: false,
          autoScale: true,
          scaleMargins: { top: 0.1, bottom: 0.1 }
        };
    }
  };

  // Hàm convert candlestick data thành bollinger data format
  const convertCandlestickToBollinger = (candlestickData: CandlestickData[], offset: number): HLCAreaData[] => {
    if (candlestickData.length === 0) return [];
    
    // Tính toán Bollinger Bands từ toàn bộ data
    const bollingerBands = calculateBollingerBands(candlestickData, 10, 2);
    
    // Convert thành HLC format và chỉ lấy offset items cuối cùng
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
    
    // Chỉ trả về offset items cuối cùng
    return allBollingerData.slice(-offset);
  };

  // Socket state
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    totalMessages: 0,
    lastMessageTime: null as string | null
  });
  const socketRef = useRef<any>(null);

  // Tab visibility state
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [lastHiddenTime, setLastHiddenTime] = useState<number | null>(null);

  // Socket message handlers
  const handleLegacyKlineUpdate = (data: SocketData) => {
    // Filter by symbol if specified
    if (symbol && data.data.symbol !== symbol) {
      return;
    }

    setRealTimeStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 1,
      lastMessageTime: new Date().toISOString()
    }));

    if (data.data.openTime) {
      // Update store with realtime data
      handleSocketMessage(data);

      const seconds = new Date(data.data.openTime).getSeconds()
      
      if (seconds === 30 || seconds === 0) {
        fetchCandles({ 
          symbol: symbol || 'BTCUSDT', 
          limit: limit 
        });
        fetchCandleTables(symbol || 'BTCUSDT');
      } else {
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
            
          } finally {
            // Reset the updating flag after a short delay to allow for smooth animations
            setTimeout(() => {
              isUpdating = false;
            }, 100);
          }
        }
      }
    }
  };
  
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
      // console.log('🔄 Reset lastCandlestickData from API data:', JSON.stringify(lastCandlestickData, null, 2));
    }
  }, [candlestickData]);

  // Socket connection effect
  useEffect(() => {
    if (!enableRealTime) return;

    const initSocket = async () => {
      try {
        const serverUrl = typeof window !== 'undefined' 
          ? window.location.origin 
          : 'http://localhost:4000'

        socketRef.current = io(serverUrl, {
          path: '/api/socketio',
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          autoConnect: true,
        })

        socketRef.current.on('connect', () => {
          console.log('🔌 Chart: Connected to Socket.IO server');
          setIsSocketConnected(true);
        });

        socketRef.current.on('disconnect', (reason: string) => {
          console.log('🔌 Chart: Disconnected from Socket.IO server:', reason);
          setIsSocketConnected(false);
        });

        // Handle legacy kline-update events
        socketRef.current.on('kline-update', (data: SocketData) => {
          handleLegacyKlineUpdate(data);
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

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      const currentTime = Date.now();
      
      if (!isVisible) {
        // Tab became hidden - record the time
        setLastHiddenTime(currentTime);
        setIsTabVisible(false);
      } else if (isVisible && !isTabVisible) {
        // Tab became visible - check if inactive time >= 15s
        const inactiveTime = lastHiddenTime ? (currentTime - lastHiddenTime) / 1000 : 0;
        
        if (inactiveTime >= 15) {
          // Tab was inactive for >= 15 seconds - refresh data
          console.log(`🔄 Tab became visible after ${inactiveTime.toFixed(1)}s inactive, refreshing data...`);
          
          // Fetch fresh data
          fetchCandles({ 
            symbol: symbol || 'BTCUSDT', 
            limit: limit 
          });
          fetchCandleTables(symbol || 'BTCUSDT');
        } else {
          console.log(`⏭️ Tab became visible after ${inactiveTime.toFixed(1)}s inactive, skipping refresh (need >= 15s)`);
        }
        
        setIsTabVisible(true);
        setLastHiddenTime(null);
      }
    };

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTabVisible, lastHiddenTime, fetchCandles, fetchCandleTables, symbol, limit]);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      // Tạo chart với theme
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: getChartHeight(), // Dynamic height based on viewport
        layout: {
          background: getBackgroundConfig(),
          textColor: theme === 'dark' ? '#f9fafb' : '#333',
        },
        grid: {
          vertLines: { 
            visible: false // Bỏ grid dọc
          },
          horzLines: { 
            color: horizontalGridColor || (theme === 'dark' ? '#374151' : '#f0f0f0'),
            visible: true,
            style: horizontalGridStyle // 0 = solid, 1 = dotted, 2 = dashed
          },
        },
        crosshair: {
          mode: 0, // Tắt crosshair để bỏ các đường ngang và label
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
          ...getGridConfig(),
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
          timeVisible: true,
          secondsVisible: true,
          barSpacing: candleWidth,
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
        priceLineStyle: LineStyle.Solid
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
              // console.log('🕯️ Candlestick Hover:', hoverInfo.candlestick);
            }
            
            if (volumeData) {
              hoverInfo.volume = {
                value: volumeData.value,
                color: volumeData.color
              };
              // console.log('📊 Volume Hover:', hoverInfo.volume);
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
        priceScaleId: 'volume', // Tạo price scale riêng cho volume
        title: '',
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // Tạo price scale riêng cho volume
      chartRef.current.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.9, // Volume ở dưới 20% của chart
          bottom: 0,
        },
      });

      // Thêm MA15 series
      ma15SeriesRef.current = chartRef.current.addLineSeries({
        color: theme === 'dark' ? 'transparent' : 'transparent', // Green
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
        color: theme === 'dark' ? '#ff0084' : '#ff0084', // Purple
        lineWidth: 2,
        title: '',
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // Thêm fake series để mở rộng trục ngang
      fakeSeriesRef.current = chartRef.current.addLineSeries({
        color: 'transparent', // Màu trong suốt
        lineWidth: 0,
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
          background: getBackgroundConfig(),
          textColor: theme === 'dark' ? '#f9fafb' : '#333',
        },
        grid: {
          vertLines: { 
            visible: false // Bỏ grid dọc
          },
          horzLines: { 
            color: horizontalGridColor || (theme === 'dark' ? '#374151' : '#f0f0f0'),
            visible: true,
            style: horizontalGridStyle // 0 = solid, 1 = dotted, 2 = dashed
          },
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#4b5563' : '#cccccc',
          ...getGridConfig(),
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
          color: theme === 'dark' ? 'transparent' : 'transparent', // Green
        });
      }

      if (ma10SeriesRef.current) {
        ma10SeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#f59e0b' : '#d97706', // Orange
        });
      }

      if (ma5SeriesRef.current) {
        ma5SeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#ff0084' : '#ff0084', // Purple
        });
      }

      // Update volume series color theo theme
      if (volumeSeriesRef.current) {
        volumeSeriesRef.current.applyOptions({
          color: theme === 'dark' ? '#3b82f6' : '#2563eb',
        });
      }

      // Set data cho tất cả series - chỉ lấy currentOffset items cuối cùng
      if (candlestickData.length > 0) {
        const lastCandlestick = candlestickData.slice(-currentOffset);
        // console.log(`📊 Setting candlestick data: ${lastCandlestick.length} items (offset: ${currentOffset})`);
        candlestickSeriesRef.current.setData(lastCandlestick);
        
        // Tính toán và set MA data
        const ma5Data = calculateMA(candlestickData, 5);
        const ma15Data = calculateMA(candlestickData, 15);
        const ma10Data = calculateMA(candlestickData, 10);
        
        const lastMA5 = ma5Data.slice(-currentOffset);
        const lastMA15 = ma15Data.slice(-currentOffset);
        const lastMA10 = ma10Data.slice(-currentOffset);
        
        ma5SeriesRef.current.setData(lastMA5);
        ma15SeriesRef.current.setData(lastMA15);
        ma10SeriesRef.current.setData(lastMA10);
        
        // Tạo và set fake data để mở rộng trục ngang
        const fakeData = generateFakeData(candlestickData, 2); // Tạo 5 item fake với time tăng dần 30s
        if (fakeSeriesRef.current && fakeData.length > 0) {
          fakeSeriesRef.current.setData(fakeData);
        }
      }
      
      // Xử lý HLC data - nếu có hlcData thì dùng, không thì convert từ candlestick
      let finalHLCData = hlcData;
      if (hlcData.length === 0 && candlestickData.length > 0) {
        // Convert candlestick thành bollinger data
        finalHLCData = convertCandlestickToBollinger(candlestickData, currentOffset);
      }
      
      if (finalHLCData.length > 0) {
        // console.log('📊 Setting HLC data:', finalHLCData.length, 'items');
        hlcSeriesRef.current.setData(finalHLCData);
      }
      
      if (volumeData.length > 0) {
        const lastVolume = volumeData.slice(-currentOffset);
        volumeSeriesRef.current.setData(lastVolume);
      }

      // Lưu visible range hiện tại trước khi update data
      if (candlestickData.length > 0 && chartRef.current) {
        // const currentVisibleRange = chartRef.current.timeScale().getVisibleRange();
        const timeScale = chartRef.current.timeScale();
        timeScale.scrollToPosition(-2, true);
      }

      // Fit content để hiển thị tất cả dữ liệu (chỉ khi không preserve zoom)
      if (!preserveZoom) {
        // chartRef.current.timeScale().fitContent();
      }
      
      // Tối ưu price scale để loại bỏ khoảng trống
      if (candlestickData.length > 0) {
        const prices = candlestickData.map(item => [item.high, item.low]).flat();
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = maxPrice - minPrice;
        const padding = priceRange * 0.05; // 5% padding
      }
    }
  }, [theme, candlestickData,]); // Thêm dependency


  useEffect(()=>{
    // Cleanup khi component unmount
    setIsMounted(true);
    return () => {
      console.log("Unmounted")
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        hlcSeriesRef.current = null;
        volumeSeriesRef.current = null;
        ma5SeriesRef.current = null;
        ma15SeriesRef.current = null;
        ma10SeriesRef.current = null;
        fakeSeriesRef.current = null;
      }
    };
  },[])

  // Handle resize with dynamic offset calculation
  const handleResize = useCallback(() => {
    if (chartContainerRef.current) {
      const newContainerWidth = chartContainerRef.current.clientWidth;
      // Always update container width to trigger re-render
      setContainerWidth(newContainerWidth);
      
      // Resize chart
      if (chartRef.current) {
        chartRef.current.resize(newContainerWidth, getChartHeight());
      }
    }
  }, [currentOffset, containerWidth]);

  useEffect(() => {
    // Initial calculation
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Handle active orders panel toggle
  useEffect(() => {
    const _ = setTimeout(() => {
      handleResize();
    }, 50);
    handleResize();
    return () => clearTimeout(_);
  }, [isActiveOrdersOpen, handleResize]);

  return (
    <div className="w-full">
      {/* Real-time Status */}
      {/* {enableRealTime && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    isSocketConnected ? 'bg-[#31baa0]' : 'bg-[#fc605f]'
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
      )} */}
      
      <div className="relative">
        {/* Hover Info Display - Overlay ở góc trái-trên */}
        {hoverData && (
          <div className="absolute top-2 left-2 z-10 bg-transparent p-2 rounded border border-gray-300 dark:border-gray-600 shadow-lg">
            {hoverData.candlestick && (
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">O:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{hoverData.candlestick.open?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">C:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{hoverData.candlestick.close?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">H:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{hoverData.candlestick.high?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">L:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{hoverData.candlestick.low?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-600 dark:text-gray-300">Vol:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {hoverData.volume?.value ? hoverData.volume.value.toFixed(2) : hoverData.candlestick.volume?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div 
          ref={chartContainerRef} 
          className="chart-container relative z-10"
          onMouseLeave={() => setHoverData(null)}
        />
      </div>
    </div>
  );
} 