"use client"

import { useState } from "react"

interface GaugeData {
  title: string
  sentiment: "STRONG SELL" | "SELL" | "NEUTRAL" | "BUY" | "STRONG BUY"
  sell: number
  neutral: number
  buy: number
}

interface GaugeIndicatorsProps {
  data?: GaugeData[]
}

const defaultData: GaugeData[] = [
  {
    title: "Oscillators",
    sentiment: "NEUTRAL",
    sell: 4,
    neutral: 2,
    buy: 3,
  },
  {
    title: "Summary",
    sentiment: "BUY",
    sell: 4,
    neutral: 2,
    buy: 15,
  },
  {
    title: "Moving Averages",
    sentiment: "STRONG BUY",
    sell: 0,
    neutral: 0,
    buy: 12,
  },
]

// Helper function to calculate gauge angle based on sentiment
const getSentimentAngle = (sentiment: string): number => {
  switch (sentiment) {
    case "STRONG SELL":
      return 0
    case "SELL":
      return 45
    case "NEUTRAL":
      return 90
    case "BUY":
      return 135
    case "STRONG BUY":
      return 180
    default:
      return 90
  }
}

// Helper function to get sentiment color
const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case "STRONG SELL":
    case "SELL":
      return "#ef4444" // red-500
    case "NEUTRAL":
      return "#6b7280" // gray-500
    case "BUY":
      return "#10b981" // emerald-500
    case "STRONG BUY":
      return "#059669" // emerald-600
    default:
      return "#6b7280"
  }
}

const GaugeIndicator = ({ data }: { data: GaugeData }) => {
  const angle = getSentimentAngle(data.sentiment)
  const sentimentColor = getSentimentColor(data.sentiment)

  return (
    <div className="flex flex-col items-center p-6 bg-card border border-border rounded-lg">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Gauge */}
      <div className="relative w-40 h-20 mb-6">
        {/* Gauge background */}
        <svg className="w-full h-full" viewBox="0 0 120 60">
          {/* Background arc */}
          <path
            d="M 15 50 A 45 45 0 0 1 105 50"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id={`gauge-gradient-${data.title}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#6b7280" />
              <stop offset="50%" stopColor="#6b7280" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="75%" stopColor="#10b981" />
              <stop offset="75%" stopColor="#059669" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Main gauge arc with gradient */}
          <path
            d="M 15 50 A 45 45 0 0 1 105 50"
            fill="none"
            stroke="url(#gauge-gradient-${data.title})"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Needle */}
          <line
            x1="60"
            y1="50"
            x2={60 + 40 * Math.cos(((angle - 90) * Math.PI) / 180)}
            y2={50 - 40 * Math.sin(((angle - 90) * Math.PI) / 180)}
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Center point */}
          <circle cx="60" cy="50" r="4" fill="#9ca3af" />
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-red-500 font-medium">
          SELL
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground font-medium">
          NEUTRAL
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-green-500 font-medium">
          BUY
        </div>
      </div>

      {/* Sentiment */}
      <div
        className="text-2xl font-bold mb-4"
        style={{ color: sentimentColor }}
      >
        {data.sentiment}
      </div>

      {/* Numerical breakdown */}
      <div className="flex gap-8 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-red-500 font-semibold">{data.sell}</span>
          <span className="text-muted-foreground text-xs">Sell</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground font-semibold">
            {data.neutral}
          </span>
          <span className="text-muted-foreground text-xs">Neutral</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-green-500 font-semibold">{data.buy}</span>
          <span className="text-muted-foreground text-xs">Buy</span>
        </div>
      </div>
    </div>
  )
}

export default function GaugeIndicators({
  data = defaultData,
}: GaugeIndicatorsProps) {
  return (
    <div className="w-full">
      {/* Gauge indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((gaugeData, index) => (
          <GaugeIndicator key={index} data={gaugeData} />
        ))}
      </div>
    </div>
  )
}
