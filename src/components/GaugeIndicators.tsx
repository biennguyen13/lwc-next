"use client"

import { useState, useEffect } from "react"
import ReactSpeedometer from "react-d3-speedometer"
import {
  useBinance30sCandlesEvents,
} from "../stores"

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

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to convert sentiment to speedometer value
const getSentimentValue = (sentiment: string): number => {
  switch (sentiment) {
    case "STRONG SELL":
      return random(9, 12)
    case "SELL":
      return random(29, 32)
    case "NEUTRAL":
      return random(49, 52)
    case "BUY":
      return random(69, 72)
    case "STRONG BUY":
      return random(89, 92)
    default:
      return 50
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
  isMobile = false,
}: {
  data: GaugeData
  isMiddle?: boolean
  isMobile?: boolean
}) => {
  const speedometerValue = getSentimentValue(data.sentiment)
  const sentimentColor = getSentimentColor(data.sentiment)

  // Speedometer dimensions - middle gauge is 10% larger
  const baseWidth = 180
  const baseHeight = 112
  const mobileScale = isMobile ? 0.65 : 1
  const speedometerWidth = (isMiddle ? baseWidth * 1.2 : baseWidth) * mobileScale
  const speedometerHeight = (isMiddle ? baseHeight * 1.2 : baseHeight) * mobileScale
  const centerX = speedometerWidth / 2
  const centerY = speedometerHeight * 0.8 // Adjust based on arc position

  // Arc parameters (semi-circle from 0° to 180°)
  const startAngle = 0 // degrees
  const endAngle = 180 // degrees
  const radius = speedometerWidth * (isMiddle ? 0.36 : 0.33) // Adjust radius as needed
  const ringWidth = 4 // Define ringWidth constant

  // Calculate positions for 5 labels
  const labels = [
    { text: "STRONG\nBUY", angle: 0 },
    { text: "BUY", angle: 45 },
    { text: "NEUTRAL", angle: 90 },
    { text: "SELL", angle: 135 },
    { text: "STRONG\nSELL", angle: 180 },
  ]

  return (
    <div className="flex flex-col items-center justify-end p-2">
      {/* Title */}
      <div className="flex items-center gap-2 md:mb-4">
        <h3 className="text-xs md:text-lg font-semibold text-foreground">{data.title}</h3>
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
      <div className="md:mb-4 relative">
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
          needleTransitionDuration={500}
          needleTransition="easeLinear"
          width={speedometerWidth}
          height={speedometerHeight + 10}
          ringWidth={4}
          textColor="#6b7280"
          valueTextFontSize={`${isMobile ? '12px' : '14px'}`}
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
                className="hidden md:block absolute transform -translate-x-1/2 -translate-y-1/2"
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
       <div className="hidden md:flex gap-8 text-sm">
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Function to generate gauge data based on candle data
  const generateGaugeDataFromCandle = (candle: any, previousCandle?: any, movingAveragesCandles?: any[]): GaugeData[] => {
    const newData = [...currentData]
    
    if (!candle || !candle.number_of_trades) {
      return newData
    }
    
    const totalTrades = candle.number_of_trades
    const isBullish = candle.close_price > candle.open_price
    const isBearish = candle.close_price < candle.open_price
    const isNeutral = candle.close_price === candle.open_price
    
    // Calculate distribution for first gauge (Oscillators)
    let oscillatorsSellRatio = 0.2
    let oscillatorsNeutralRatio = 0.2
    let oscillatorsBuyRatio = 0.6
    
    if (isBullish) {
      // Oscillators: close price > open price -> buy 60%, neutral 20%, sell 20%
      oscillatorsSellRatio = 0.33
      oscillatorsNeutralRatio = 0.34
      oscillatorsBuyRatio = 0.33
    } else {
      // Oscillators: close price <= open price -> buy 20%, neutral 20%, sell 60%
      oscillatorsSellRatio = 0.33
      oscillatorsNeutralRatio = 0.34
      oscillatorsBuyRatio = 0.33
    }
    
    // Calculate actual numbers for Oscillators
    let oscillatorsSell = Math.round(totalTrades * oscillatorsSellRatio)
    let oscillatorsNeutral = Math.round(totalTrades * oscillatorsNeutralRatio)
    let oscillatorsBuy = Math.round(totalTrades * oscillatorsBuyRatio)
    
    // Ensure total equals number_of_trades for Oscillators
    const oscillatorsTotal = oscillatorsSell + oscillatorsNeutral + oscillatorsBuy
    const oscillatorsDifference = totalTrades - oscillatorsTotal
    
    // Distribute the difference for Oscillators
    if (oscillatorsDifference > 0) {
      if (oscillatorsSell >= oscillatorsNeutral && oscillatorsSell >= oscillatorsBuy) {
        oscillatorsSell += oscillatorsDifference
      } else if (oscillatorsNeutral >= oscillatorsSell && oscillatorsNeutral >= oscillatorsBuy) {
        oscillatorsNeutral += oscillatorsDifference
      } else {
        oscillatorsBuy += oscillatorsDifference
      }
    }
    
    // Determine sentiment based on distribution
    const determineSentiment = (sell: number, neutral: number, buy: number): "STRONG SELL" | "SELL" | "NEUTRAL" | "BUY" | "STRONG BUY" => {
      if (buy > sell * 2) {
        return "STRONG BUY"
      } else if (buy > sell) {
        return "BUY"
      } else if (sell > buy * 2) {
        return "STRONG SELL"
      } else if (sell > buy) {
        return "SELL"
      } else {
        return "NEUTRAL"
      }
    }
    
    // Update first gauge (Oscillators)
    newData[0] = {
      title: "Oscillators",
      sentiment: determineSentiment(oscillatorsSell, oscillatorsNeutral, oscillatorsBuy),
      sell: oscillatorsSell,
      neutral: oscillatorsNeutral,
      buy: oscillatorsBuy,
    }
    
    // Initialize Summary with Oscillators values (will be updated after Moving Averages calculation)
    let summarySell = oscillatorsSell
    let summaryNeutral = oscillatorsNeutral
    let summaryBuy = oscillatorsBuy
    
    // Calculate Moving Averages (third gauge) based on angle between two candles
    if (previousCandle && previousCandle.close_price && movingAveragesCandles && movingAveragesCandles.length >= 5) {
      const currentPrice = candle.close_price
      const previousPrice = previousCandle.open_price
      const timeDiff = (candle.open_time - previousCandle.close_time) / 1000 // seconds
      
      // Calculate total number_of_trades from 5 candles
      const totalTradesForMovingAverages = movingAveragesCandles.reduce((sum, c) => sum + (c?.number_of_trades || 0), 0)
      
      // Calculate angle in degrees
      const priceDiff = currentPrice - previousPrice
      const angleRadians = Math.atan2(priceDiff, timeDiff)
      const angleDegrees = (angleRadians * 180) / Math.PI
      
      // console.log('📐 Moving Averages angle calculation:', {
      //   previousPrice,
      //   currentPrice,
      //   priceDiff,
      //   timeDiff,
      //   angleDegrees,
      //   totalTradesForMovingAverages
      // })
      
      // Determine sentiment based on angle
      let movingAveragesSentiment: "STRONG SELL" | "SELL" | "NEUTRAL" | "BUY" | "STRONG BUY"
      let movingAveragesSellRatio = 0.33
      let movingAveragesNeutralRatio = 0.34
      let movingAveragesBuyRatio = 0.33
      
      if (angleDegrees >= 46) {
        // Strong Buy: >= 46 degrees
        movingAveragesSentiment = "STRONG BUY"
        movingAveragesSellRatio = 0.2
        movingAveragesNeutralRatio = 0.2
        movingAveragesBuyRatio = 0.6
      } else if (angleDegrees >= 15 && angleDegrees < 46) {
        // Buy: 17 to 53 degrees
        movingAveragesSentiment = "BUY"
        movingAveragesSellRatio = 0.3
        movingAveragesNeutralRatio = 0.3
        movingAveragesBuyRatio = 0.4
      } else if (angleDegrees >= -15 && angleDegrees < 15) {
        // Neutral: -17 to 16 degrees
        movingAveragesSentiment = "NEUTRAL"
        movingAveragesSellRatio = 0.33
        movingAveragesNeutralRatio = 0.34
        movingAveragesBuyRatio = 0.33
      } else if (angleDegrees >= -46 && angleDegrees < -15) {
        // Sell: -46 to -17 degrees
        movingAveragesSentiment = "SELL"
        movingAveragesSellRatio = 0.4
        movingAveragesNeutralRatio = 0.3
        movingAveragesBuyRatio = 0.3
      } else {
        // Strong Sell: -90 to -46 degrees
        movingAveragesSentiment = "STRONG SELL"
        movingAveragesSellRatio = 0.6
        movingAveragesNeutralRatio = 0.2
        movingAveragesBuyRatio = 0.2
      }
      
      // Calculate actual numbers for Moving Averages using total trades from 5 candles
      let movingAveragesSell = Math.round(totalTradesForMovingAverages * movingAveragesSellRatio)
      let movingAveragesNeutral = Math.round(totalTradesForMovingAverages * movingAveragesNeutralRatio)
      let movingAveragesBuy = Math.round(totalTradesForMovingAverages * movingAveragesBuyRatio)
      
      // Add random variation ±1-5% to each value
      const addRandomVariation = (value: number) => {
        const variationPercent = Math.random() * 1 + 1 // 1-5%
        const variation = Math.random() < 0.5 ? 1 : -1 // Random positive or negative
        const adjustment = Math.round(value * (variationPercent / 100) * variation)
        return Math.max(0, value + adjustment) // Ensure non-negative
      }
      
      movingAveragesSell = addRandomVariation(movingAveragesSell)
      movingAveragesNeutral = addRandomVariation(movingAveragesNeutral)
      movingAveragesBuy = addRandomVariation(movingAveragesBuy)
      
      // Ensure total equals totalTradesForMovingAverages for Moving Averages
      const movingAveragesTotal = movingAveragesSell + movingAveragesNeutral + movingAveragesBuy
      const movingAveragesDifference = totalTradesForMovingAverages - movingAveragesTotal
      
      // Distribute the difference for Moving Averages
      if (movingAveragesDifference > 0) {
        if (movingAveragesSell >= movingAveragesNeutral && movingAveragesSell >= movingAveragesBuy) {
          movingAveragesSell += movingAveragesDifference
        } else if (movingAveragesNeutral >= movingAveragesSell && movingAveragesNeutral >= movingAveragesBuy) {
          movingAveragesNeutral += movingAveragesDifference
        } else {
          movingAveragesBuy += movingAveragesDifference
        }
      }
      
      // Update third gauge (Moving Averages)
      newData[2] = {
        title: "Moving Averages",
        sentiment: movingAveragesSentiment,
        sell: movingAveragesSell,
        neutral: movingAveragesNeutral,
        buy: movingAveragesBuy,
      }
      
      // console.log('📊 Moving Averages result:', {
      //   angle: angleDegrees.toFixed(2) + '°',
      //   sentiment: movingAveragesSentiment,
      //   totalTrades: totalTradesForMovingAverages,
      //   sell: movingAveragesSell,
      //   neutral: movingAveragesNeutral,
      //   buy: movingAveragesBuy,
      //   totalAfterVariation: movingAveragesSell + movingAveragesNeutral + movingAveragesBuy
      // })
      
      // Add Moving Averages values to Summary
      summarySell += movingAveragesSell
      summaryNeutral += movingAveragesNeutral
      summaryBuy += movingAveragesBuy
      
      // console.log('📊 Summary calculation:', {
      //   oscillators: { sell: oscillatorsSell, neutral: oscillatorsNeutral, buy: oscillatorsBuy },
      //   movingAverages: { sell: movingAveragesSell, neutral: movingAveragesNeutral, buy: movingAveragesBuy },
      //   summary: { sell: summarySell, neutral: summaryNeutral, buy: summaryBuy }
      // })
    }
    
    // Update second gauge (Summary)
    newData[1] = {
      title: "Summary",
      sentiment: determineSentiment(summarySell, summaryNeutral, summaryBuy),
      sell: summarySell,
      neutral: summaryNeutral,
      buy: summaryBuy,
    }
    
    return newData
  }

  // Listen for candle updates and trigger gauge updates based on candle data
  useBinance30sCandlesEvents(({payload: candles}) => {
    console.log("🔄 Candle update received, triggering gauge update based on candle data...")
    const candle = candles[candles.length - 2]
    const previousCandle = candles[candles.length - 6] // 4 candles back
    
    // Get 5 candles for Moving Averages calculation
    const movingAveragesCandles = [
      candles[candles.length - 6], // 5 candles back
      candles[candles.length - 5], // 4 candles back
      candles[candles.length - 4], // 3 candles back
      candles[candles.length - 3], // 2 candles back
      candles[candles.length - 2]  // 1 candle back (current)
    ]
    
    // console.log('📊 Candle data:', {
    //   number_of_trades: candle?.number_of_trades,
    //   open_price: candle?.open_price,
    //   close_price: candle?.close_price,
    //   price_change: candle?.close_price - candle?.open_price
    // })
    
    // console.log('📊 Previous candle data:', {
    //   close_price: previousCandle?.close_price,
    //   time_diff: previousCandle ? (candle?.open_time - previousCandle?.close_time) / 1000 : 0
    // })
    
    // console.log('📊 Moving Averages candles:', {
    //   total_candles: movingAveragesCandles.length,
    //   trades_sum: movingAveragesCandles.reduce((sum, c) => sum + (c?.number_of_trades || 0), 0)
    // })
    
    // Generate gauge data based on candle when candles update
    setCurrentData(prevData => {
      const newData = generateGaugeDataFromCandle(candle, previousCandle, movingAveragesCandles)
      return newData
    })
  })

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
      {/* Mobile Gauge indicators (< 1024px) */}
      {isMobile && (
        <div className="grid gap-2 md:gap-6 gauge-indicators-grid">
          {currentData.map((gaugeData, index) => (
            <GaugeIndicator 
              key={index} 
              data={gaugeData} 
              isMiddle={index === 1} 
              isMobile={true}
            />
          ))}
        </div>
      )}

      {/* Desktop Gauge indicators (>= 1024px) */}
      {!isMobile && (
        <div className="grid gap-2 md:gap-6 gauge-indicators-grid">
          {currentData.map((gaugeData, index) => (
            <GaugeIndicator 
              key={index} 
              data={gaugeData} 
              isMiddle={index === 1} 
              isMobile={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
