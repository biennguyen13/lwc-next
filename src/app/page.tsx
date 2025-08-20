"use client"

import { useState } from "react"
import { Binance30sTest } from "@/components/Binance30sTest"
import Binance30sChart from "@/components/Binance30sChart"
import CandleTables from "@/components/CandleTables"
import GaugeIndicators from "@/components/GaugeIndicators"
import TradingPanel from "@/components/TradingPanel"

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<"gauges" | "candles">(
    "gauges"
  ) // Main tab state

  return (
    <main className="min-h-screen p-2 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-[100vw] mx-auto">
        {/* Binance 30s Test Component */}
        {/* <div className="mb-8">
          <Binance30sTest />
        </div> */}

        {/* Chart and Trading Panel Layout */}
        <div className="mb-6 md:mb-8 flex">
          {/* Chart Area */}
          <div className="flex-1 w-[calc(100vw-210px-24px)]">
            <Binance30sChart
              limit={200}
              symbol="BTCUSDT"
              title="Binance 30s Real-time Chart"
            />

            {/* Tabs Container */}
            <div className="my-2 md:my-8 px-6">
              {/* Tab Navigation */}
              <div className="flex items-center gap-6 mb-6">
                <button
                  onClick={() => setActiveMainTab("gauges")}
                  className={`text-lg font-medium transition-colors ${
                    activeMainTab === "gauges"
                      ? "text-foreground border-b-2 border-orange-500 pb-1"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Indicators
                </button>
                <button
                  onClick={() => setActiveMainTab("candles")}
                  className={`text-lg font-medium transition-colors ${
                    activeMainTab === "candles"
                      ? "text-foreground border-b-2 border-orange-500 pb-1"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Last Results
                </button>
              </div>

              {/* Tab Content */}
              <div className="">
                <div className={`flex justify-center max-w-[1000px] mx-auto ${activeMainTab !== "gauges" ? "hidden" : ""}`}>
                  <GaugeIndicators />
                </div>

                <div className={`${activeMainTab !== "candles" ? "hidden" : ""}`}>
                  <CandleTables
                    symbol="BTCUSDT"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="flex-shrink-0 w-[210px]">
            <TradingPanel/>
          </div>
        </div>
      </div>
    </main>
  )
}
