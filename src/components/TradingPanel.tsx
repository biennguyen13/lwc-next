'use client';

import { useState } from 'react';

interface TradingPanelProps {
  currentPrice?: number;
  countdownTime?: number;
}

export default function TradingPanel({ 
  currentPrice = 116360.96, 
  countdownTime = 20 
}: TradingPanelProps) {
  const [value, setValue] = useState<number>(10);
  const [profit, setProfit] = useState<number>(19.5);
  const [profitPercentage, setProfitPercentage] = useState<number>(95);
  const [sentiment, setSentiment] = useState<{ bearish: number; bullish: number }>({
    bearish: 49,
    bullish: 51
  });

  const quickValues = [5, 10, 20, 50, 100];

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
  };

  const handleQuickValue = (quickValue: number) => {
    setValue(prev => prev + quickValue);
  };

  const handleAll = () => {
    setValue(1000); // Set to a high value for "All"
  };

  const handleIncrease = () => {
    console.log('TĂNG - Buy order placed with value:', value);
    // Add your buy logic here
  };

  const handleDecrease = () => {
    console.log('GIẢM - Sell order placed with value:', value);
    // Add your sell logic here
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 rounded-lg p-2 space-y-6">
      {/* Giá trị (Value) Section */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-lg">Giá trị</h3>
        
        {/* Value Input */}
        <div className="flex items-center bg-gray-700 dark:bg-gray-800 rounded-lg p-3">
          <button
            onClick={() => handleValueChange(Math.max(0, value - 1))}
            className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-l flex items-center justify-center transition-colors"
          >
            -
          </button>
          <div className="flex-1 px-3 py-2 text-center">
            <span className="text-white font-bold text-lg">${value}</span>
          </div>
          <button
            onClick={() => handleValueChange(value + 1)}
            className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-r flex items-center justify-center transition-colors"
          >
            +
          </button>
          <button
            onClick={() => handleValueChange(0)}
            className="ml-2 w-8 h-8 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>

        {/* Quick Value Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {quickValues.map((quickValue) => (
            <button
              key={quickValue}
              onClick={() => handleQuickValue(quickValue)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm font-medium"
            >
              +{quickValue}
            </button>
          ))}
          <button
            onClick={handleAll}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-sm font-medium col-span-3"
          >
            All
          </button>
        </div>
      </div>

      {/* Lợi nhuận (Profit) Section */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-lg">Lợi nhuận</h3>
        <div className="space-y-1">
          <div className="text-blue-400 font-bold text-xl">{profitPercentage}%</div>
          <div className="text-green-400 font-bold text-lg">+${profit}</div>
        </div>
      </div>

      {/* Chỉ báo tâm lý (Sentiment Indicator) Section */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-lg">Chỉ báo tâm lý</h3>
        
        {/* Sentiment Bar */}
        <div className="relative h-8 bg-gray-700 dark:bg-gray-800 rounded-lg overflow-hidden">
          {/* Bearish (Red) */}
          <div 
            className="absolute left-0 top-0 h-full bg-red-500 flex items-center justify-center"
            style={{ width: `${sentiment.bearish}%` }}
          >
            <span className="text-white font-bold text-sm">{sentiment.bearish}%</span>
          </div>
          
          {/* Bullish (Green) */}
          <div 
            className="absolute right-0 top-0 h-full bg-green-500 flex items-center justify-center"
            style={{ width: `${sentiment.bullish}%` }}
          >
            <span className="text-white font-bold text-sm">{sentiment.bullish}%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* TĂNG Button */}
        <button
          onClick={handleIncrease}
          className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          TĂNG
        </button>

        {/* Place Order Button */}
        <button className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors">
          Hãy đặt lệnh
          <div className="text-xs text-gray-300 mt-1">{countdownTime}s</div>
        </button>

        {/* GIẢM Button */}
        <button
          onClick={handleDecrease}
          className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          GIẢM
        </button>
      </div>

      {/* Current Price Display */}
      <div className="text-center pt-4 border-t border-gray-700 dark:border-gray-600">
        <div className="text-yellow-400 font-bold text-xl">{currentPrice.toLocaleString()}</div>
        <div className="text-gray-400 text-sm">Current Price</div>
      </div>
    </div>
  );
}
