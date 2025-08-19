"use client"

import { useState } from "react"
import ReactSpeedometer from "react-d3-speedometer"

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

// Demo scenarios for different market conditions
const demoScenarios = {
  bullish: [
    {
      title: "Oscillators",
      sentiment: "STRONG BUY" as const,
      sell: 1,
      neutral: 1,
      buy: 8,
    },
    {
      title: "Summary",
      sentiment: "STRONG BUY" as const,
      sell: 2,
      neutral: 1,
      buy: 18,
    },
    {
      title: "Moving Averages",
      sentiment: "STRONG BUY" as const,
      sell: 0,
      neutral: 0,
      buy: 15,
    },
  ],
  bearish: [
    {
      title: "Oscillators",
      sentiment: "STRONG SELL" as const,
      sell: 8,
      neutral: 1,
      buy: 1,
    },
    {
      title: "Summary",
      sentiment: "STRONG SELL" as const,
      sell: 18,
      neutral: 1,
      buy: 2,
    },
    {
      title: "Moving Averages",
      sentiment: "STRONG SELL" as const,
      sell: 15,
      neutral: 0,
      buy: 0,
    },
  ],
  neutral: [
    {
      title: "Oscillators",
      sentiment: "NEUTRAL" as const,
      sell: 3,
      neutral: 5,
      buy: 2,
    },
    {
      title: "Summary",
      sentiment: "NEUTRAL" as const,
      sell: 6,
      neutral: 10,
      buy: 5,
    },
    {
      title: "Moving Averages",
      sentiment: "NEUTRAL" as const,
      sell: 5,
      neutral: 8,
      buy: 2,
    },
  ],
  mixed: [
    {
      title: "Oscillators",
      sentiment: "BUY" as const,
      sell: 2,
      neutral: 3,
      buy: 5,
    },
    {
      title: "Summary",
      sentiment: "SELL" as const,
      sell: 8,
      neutral: 4,
      buy: 3,
    },
    {
      title: "Moving Averages",
      sentiment: "BUY" as const,
      sell: 1,
      neutral: 2,
      buy: 7,
    },
  ],
}

// Helper function to convert sentiment to speedometer value
const getSentimentValue = (sentiment: string): number => {
  switch (sentiment) {
    case "STRONG SELL":
      return 20
    case "SELL":
      return 40
    case "NEUTRAL":
      return 60
    case "BUY":
      return 80
    case "STRONG BUY":
      return 100
    default:
      return 60
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

const GaugeIndicator = ({
  data,
  isMiddle = false,
}: {
  data: GaugeData
  isMiddle?: boolean
}) => {
  const speedometerValue = getSentimentValue(data.sentiment)
  const sentimentColor = getSentimentColor(data.sentiment)

  // Speedometer dimensions - middle gauge is 10% larger
  const baseWidth = 180
  const baseHeight = 112
  const speedometerWidth = isMiddle ? baseWidth * 1.2 : baseWidth
  const speedometerHeight = isMiddle ? baseHeight * 1.2 : baseHeight
  const centerX = speedometerWidth / 2
  const centerY = speedometerHeight * 0.8 // Adjust based on arc position

  // Arc parameters (semi-circle from 0° to 180°)
  const startAngle = 0 // degrees
  const endAngle = 180 // degrees
  const radius = speedometerWidth * (isMiddle ? 0.36 : 0.33) // Adjust radius as needed
  const ringWidth = 4 // Define ringWidth constant

  // Calculate positions for 5 labels
  const labels = [
    { text: "STRONG\nSELL", angle: 0 },
    { text: "SELL", angle: 45 },
    { text: "NEUTRAL", angle: 90 },
    { text: "BUY", angle: 135 },
    { text: "STRONG\nBUY", angle: 180 },
  ]

  return (
    <div className="flex flex-col items-center justify-end p-2">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
        {/* <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </button> */}
      </div>

      {/* Speedometer */}
      <div className="mb-4 relative">
        {/* Semi-circular gradient background */}
        <div
          className="absolute inset-0 rounded-t-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(128,128,128,0.3) 50%, rgba(0,0,0,0.6) 100%)",
            width: `${speedometerWidth * 0.8}px`,
            height: `${speedometerHeight * 0.67}px`,
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        />

        <ReactSpeedometer
          value={speedometerValue}
          minValue={0}
          maxValue={100}
          segments={5}
          segmentColors={[
            "#ef5350", // STRONG SELL - Red
            "#f59896", // SELL - Orange
            "#a4a6ad", // NEUTRAL - Gray
            "#75c8a8", // BUY - Green
            "#31baa0", // STRONG BUY - Dark Green
          ]}
          needleColor="#9ca3af"
          needleHeightRatio={0.6}
          needleBaseWidth={8}
          needleTransitionDuration={2000}
          needleTransition="easeElastic"
          width={speedometerWidth}
          height={speedometerHeight + 10}
          ringWidth={4}
          textColor="#6b7280"
          valueTextFontSize="14px"
          labelFontSize="12px"
          currentValueText={`${data.sentiment}`}
          customSegmentLabels={[
            { text: "", position: "OUTSIDE", color: "#ef4444" },
            { text: "", position: "OUTSIDE", color: "#f97316" },
            { text: "", position: "OUTSIDE", color: "#6b7280" },
            { text: "", position: "OUTSIDE", color: "#10b981" },
            { text: "", position: "OUTSIDE", color: "#059669" },
          ]}
        />

        {/* Custom arc-aligned labels */}
        <div className="absolute inset-0 pointer-events-none">
          {labels.map((label, index) => {
            // Convert angle to radians
            const angleRad = (label.angle * Math.PI) / 180

            // Calculate position on arc
            const labelRadius = radius + 25 // Slightly outside the arc
            let x = centerX + labelRadius * Math.cos(angleRad)
            let y = centerY - labelRadius * Math.sin(angleRad)

            // Adjust first and last labels
            if (index === 0) {
              // STRONG SELL - move left
              x -= -10
              y -= 10
            } else if (index === 4) {
              // STRONG BUY - move right
              x += -10
              y -= 10
            }

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                }}
              >
                <span
                  className="text-[10px] font-normal text-center leading-tight text-muted-foreground"
                  style={{
                    whiteSpace: "pre-line",
                    display: "block",
                  }}
                >
                  {label.text}
                </span>
              </div>
            )
          })}
        </div>

        {/* Segment separator lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            width: `${speedometerWidth * 0.8}px`,
            height: `${speedometerHeight * 0.67}px`,
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          {/* STRONG SELL to SELL separator */}
          <div
            className="absolute"
            style={{
              left: "52%",
              top: "64%",
              width: "2px",
              height: `${ringWidth}px`,
              backgroundColor: "#3f3f3f",
              transform: `translate(-50%, -50%) rotate(-72deg) translateY(-${radius}px)`,
              transformOrigin: "center bottom",
              zIndex: 10,
            }}
          />

          {/* SELL to NEUTRAL separator */}
          <div
            className="absolute"
            style={{
              left: "59%",
              top: "71%",
              width: "2px",
              height: `${ringWidth}px`,
              backgroundColor: "#3f3f3f",
              transform: `translate(-50%, -50%) rotate(-36deg) translateY(-${radius}px)`,
              transformOrigin: "center bottom",
              zIndex: 10,
            }}
          />

          {/* BUY to STRONG BUY separator */}
          <div
            className="absolute"
            style={{
              left: "40%",
              top: "70%",
              width: "2px",
              height: `${ringWidth}px`,
              backgroundColor: "#3f3f3f",
              transform: `translate(-50%, -50%) rotate(36deg) translateY(-${radius}px)`,
              transformOrigin: "center bottom",
              zIndex: 10,
            }}
          />

          {/* STRONG BUY to STRONG SELL separator (vertical line) */}
          <div
            className="absolute"
            style={{
              left: "48%",
              top: "62%",
              width: "2px",
              height: `${ringWidth}px`,
              backgroundColor: "#3f3f3f",
              transform: `translate(-50%, -50%) rotate(72deg) translateY(-${radius}px)`,
              transformOrigin: "center bottom",
              zIndex: 10,
            }}
          />
        </div>
      </div>

      {/* Sentiment */}
      {/* <div
        className="text-2xl font-bold mb-4"
        style={{ color: sentimentColor }}
      >
        {data.sentiment}
      </div> */}

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
  const [currentData, setCurrentData] = useState<GaugeData[]>(data)
  const [currentScenario, setCurrentScenario] = useState<string>("default")

  const handleScenarioChange = (
    scenario: keyof typeof demoScenarios | "default"
  ) => {
    if (scenario === "default") {
      setCurrentData(defaultData)
    } else {
      setCurrentData(demoScenarios[scenario])
    }
    setCurrentScenario(scenario)
  }

  return (
    <div className="w-full">
      {/* Demo Controls */}
      <div className="mb-6 p-4 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Demo Market Scenarios
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleScenarioChange("default")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentScenario === "default"
                ? "bg-orange-500 text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            Default
          </button>
          <button
            onClick={() => handleScenarioChange("bullish")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentScenario === "bullish"
                ? "bg-green-500 text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            🚀 Bullish Market
          </button>
          <button
            onClick={() => handleScenarioChange("bearish")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentScenario === "bearish"
                ? "bg-red-500 text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            📉 Bearish Market
          </button>
          <button
            onClick={() => handleScenarioChange("neutral")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentScenario === "neutral"
                ? "bg-gray-500 text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            ↔️ Neutral Market
          </button>
          <button
            onClick={() => handleScenarioChange("mixed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentScenario === "mixed"
                ? "bg-purple-500 text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            🔀 Mixed Signals
          </button>
        </div>

        {/* Current Scenario Info */}
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Current Scenario:</strong>{" "}
            {currentScenario.charAt(0).toUpperCase() + currentScenario.slice(1)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click buttons above to see how gauges react to different market
            conditions
          </p>
        </div>
      </div>

      {/* Gauge indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentData.map((gaugeData, index) => (
          <GaugeIndicator key={index} data={gaugeData} />
        ))}
      </div>
    </div>
  )
}
