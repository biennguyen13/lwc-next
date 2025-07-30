// Binance API service để lấy dữ liệu candlestick của BTC
export interface BinanceCandlestick {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Hàm lấy dữ liệu candlestick từ Binance API
export const fetchBinanceCandlestick = async (
  symbol: string = 'BTCUSDT',
  interval: string = '1h',
  limit: number = 200
): Promise<CandlestickData[]> => {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    
    console.log('🔄 Fetching data from Binance API:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert Binance data format thành Lightweight Charts format
    const candlestickData: CandlestickData[] = data.map((item: any[]) => ({
      time: item[0] / 1000, // Convert milliseconds to seconds
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
    }));
    
    console.log('✅ Fetched', candlestickData.length, 'candlestick data points from Binance');
    
    return candlestickData;
  } catch (error) {
    console.error('❌ Error fetching data from Binance:', error);
    throw error;
  }
};

// Hàm lấy dữ liệu volume từ candlestick data
export const extractVolumeData = (candlestickData: CandlestickData[]) => {
  return candlestickData.map((item, index) => ({
    time: item.time,
    value: item.volume,
    color: item.close >= item.open ? '#26a69a' : '#ef5350',
  }));
};

// Các interval có sẵn của Binance
export const BINANCE_INTERVALS = {
  '1m': '1 minute',
  '3m': '3 minutes',
  '5m': '5 minutes',
  '15m': '15 minutes',
  '30m': '30 minutes',
  '1h': '1 hour',
  '2h': '2 hours',
  '4h': '4 hours',
  '6h': '6 hours',
  '8h': '8 hours',
  '12h': '12 hours',
  '1d': '1 day',
  '3d': '3 days',
  '1w': '1 week',
  '1M': '1 month',
} as const;

export type BinanceInterval = keyof typeof BINANCE_INTERVALS; 