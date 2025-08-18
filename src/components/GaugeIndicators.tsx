'use client';

import { useState } from 'react';

interface GaugeData {
  title: string;
  sentiment: 'STRONG SELL' | 'SELL' | 'NEUTRAL' | 'BUY' | 'STRONG BUY';
  sell: number;
  neutral: number;
  buy: number;
}

interface GaugeIndicatorsProps {
  data?: GaugeData[];
}

const defaultData: GaugeData[] = [
  {
    title: 'Oscillators',
    sentiment: 'NEUTRAL',
    sell: 4,
    neutral: 2,
    buy: 3
  },
  {
    title: 'Summary',
    sentiment: 'BUY',
    sell: 4,
    neutral: 2,
    buy: 15
  },
  {
    title: 'Moving Averages',
    sentiment: 'STRONG BUY',
    sell: 0,
    neutral: 0,
    buy: 12
  }
];

// Helper function to calculate gauge angle based on sentiment
const getSentimentAngle = (sentiment: string): number => {
  switch (sentiment) {
    case 'STRONG SELL': return 0;
    case 'SELL': return 45;
    case 'NEUTRAL': return 90;
    case 'BUY': return 135;
    case 'STRONG BUY': return 180;
    default: return 90;
  }
};

// Helper function to get sentiment color
const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'STRONG SELL':
    case 'SELL':
      return '#ef4444'; // red-500
    case 'NEUTRAL':
      return '#6b7280'; // gray-500
    case 'BUY':
      return '#10b981'; // emerald-500
    case 'STRONG BUY':
      return '#059669'; // emerald-600
    default:
      return '#6b7280';
  }
};

const GaugeIndicator = ({ data }: { data: GaugeData }) => {
  const angle = getSentimentAngle(data.sentiment);
  const sentimentColor = getSentimentColor(data.sentiment);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-600">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-white">{data.title}</h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Gauge */}
      <div className="relative w-32 h-16 mb-4">
        {/* Gauge background */}
        <svg className="w-full h-full" viewBox="0 0 100 50">
          {/* Background arc */}
          <path
            d="M 10 40 A 40 40 0 0 1 90 40"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Color segments */}
          <path
            d="M 10 40 A 40 40 0 0 1 30 40"
            fill="none"
            stroke="#ef4444"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 30 40 A 40 40 0 0 1 50 40"
            fill="none"
            stroke="#6b7280"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 50 40 A 40 40 0 0 1 70 40"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 70 40 A 40 40 0 0 1 90 40"
            fill="none"
            stroke="#059669"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <line
            x1="50"
            y1="40"
            x2={50 + 35 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={40 - 35 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke={sentimentColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Center point */}
          <circle cx="50" cy="40" r="3" fill={sentimentColor} />
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-red-400 font-medium">SELL</div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-medium">NEUTRAL</div>
        <div className="absolute bottom-0 right-0 text-xs text-green-400 font-medium">BUY</div>
      </div>

      {/* Sentiment */}
      <div className="text-2xl font-bold text-white mb-4" style={{ color: sentimentColor }}>
        {data.sentiment}
      </div>

      {/* Numerical breakdown */}
      <div className="flex gap-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-red-400 font-semibold">{data.sell}</span>
          <span className="text-gray-400 text-xs">Sell</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400 font-semibold">{data.neutral}</span>
          <span className="text-gray-400 text-xs">Neutral</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-green-400 font-semibold">{data.buy}</span>
          <span className="text-gray-400 text-xs">Buy</span>
        </div>
      </div>
    </div>
  );
};

export default function GaugeIndicators({ data = defaultData }: GaugeIndicatorsProps) {
  return (
    <div className="w-full">
      {/* Gauge indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((gaugeData, index) => (
          <GaugeIndicator key={index} data={gaugeData} />
        ))}
      </div>
    </div>
  );
}
