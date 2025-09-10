"use client"

import { useState } from "react"
import { Binance30sTest } from "@/components/Binance30sTest"
import Binance30sChart from "@/components/Binance30sChart"
import CandleTables from "@/components/CandleTables"
import GaugeIndicators from "@/components/GaugeIndicators"
import TradingPanel from "@/components/TradingPanel"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<"gauges" | "candles">(
    "gauges"
  ) // Main tab state

  return (
    <main className="min-h-screen p-2 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-[100vw] mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex justify-center">
          <Link href="/wallet-main">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>💰</span>
              <span>Ví của tôi</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
