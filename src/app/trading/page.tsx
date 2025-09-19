"use client"

import { useState, useEffect } from "react"
import { Binance30sTest } from "@/components/Binance30sTest"
import Binance30sChart from "@/components/Binance30sChart"
import CandleTables from "@/components/CandleTables"
import GaugeIndicators from "@/components/GaugeIndicators"
import TradingPanel from "@/components/TradingPanel"
import MobileTradingPanel from "@/components/MobileTradingPanel"
import { ActiveOrdersPanel } from "@/components/ActiveOrdersPanel"
import { WinPopup } from "@/components/WinPopup"
import { useActiveOrders } from "@/contexts/ActiveOrdersContext"
import { useBinance30sRealtimeEvents } from "@/stores/use-store-events"
import { useBettingStore, useWalletStore } from "@/stores"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<"gauges" | "candles">(
    "gauges"
  ) // Main tab state
  const { isActiveOrdersOpen, closeActiveOrders } = useActiveOrders()
  const [offsetWidth, setOffsetWidth] = useState('200px')
  const [isShowTradingPanel, setIsShowTradingPanel] = useState(true)
  const [isShowActiveOrdersPanel, setIsShowActiveOrdersPanel] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  // Win popup state
  const [isWinPopupOpen, setIsWinPopupOpen] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  
  // Store hooks
  const { fetchRecentOrdersTotalPayout } = useBettingStore()
  const { bettingMode } = useWalletStore()
  
  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setOffsetWidth(window.innerWidth < 767.99 ? '0' : window.innerWidth < 1024 ? '185px' : '200px')
      setIsShowTradingPanel(window.innerWidth < 767.99 ? false : true)
      setIsShowActiveOrdersPanel(window.innerWidth < 767.99 ? false : true)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 767.99)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Listen for realtime updates and check for win results
  useBinance30sRealtimeEvents((realtimeData) => {
    if (realtimeData?.payload?.second === 28 && realtimeData?.payload?.isBet) {
      console.log('🎯 Checking for win results at second 28...')
      
      // Fetch recent orders total payout
      fetchRecentOrdersTotalPayout({ mode: 'real' })
        .then((data) => {
          console.log('💰 Recent orders total payout:', data)
          
          if (data && data.total_payout > 0) {
            console.log('🎉 WIN! Total payout:', data.total_payout)
            setWinAmount(data.total_payout)
            setIsWinPopupOpen(true)
          }
        })
        .catch((error) => {
          console.error('❌ Error fetching recent orders total payout:', error)
        })
    }
  })
  
  return (
    <div className="p-1 pr-0 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-[100vw] mx-auto flex-grow">
        {/* Binance 30s Test Component */}
        {/* <div className="mb-8">
          <Binance30sTest />
        </div> */}

        {/* Chart, Trading Panel, and Active Orders Layout */}
        <div 
          className="transition-all duration-500"
          style={{
            display: 'grid',
            gridTemplateColumns: isActiveOrdersOpen 
              ? `1fr ${offsetWidth} ${offsetWidth}` 
              : `1fr ${offsetWidth} 0px`,
            gap: '0'
          }}
        >
          {/* Chart Area */}
          <div className="min-w-0">
            <Binance30sChart
              limit={200}
              symbol="BTCUSDT"
            />
          </div>

          {/* Trading Panel */}
          {
            isShowTradingPanel && <div className="flex-shrink-0">
            <TradingPanel/>
          </div>
          }

          {/* Active Orders Panel */}
          {
            isShowActiveOrdersPanel && <ActiveOrdersPanel 
            isOpen={isActiveOrdersOpen}
            onClose={closeActiveOrders}
          />
          }
        </div>

        {/* Tabs Container */}
        <div className="md:my-8 px-1 lg:px-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mb-2 lg:mb-6">
            <button
              onClick={() => setActiveMainTab("gauges")}
              className={`text-base lg:text-lg font-medium transition-colors ${
                activeMainTab === "gauges"
                  ? "text-foreground border-b-2 border-orange-500 pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Indicators
            </button>
            <button
              onClick={() => setActiveMainTab("candles")}
              className={`text-base lg:text-lg font-medium transition-colors ${
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

      {/* Mobile Trading Panel - Fixed at bottom */}
      {isMobile && <MobileTradingPanel />}
      
      {/* Win Popup */}
      <WinPopup
        isOpen={isWinPopupOpen}
        onClose={() => setIsWinPopupOpen(false)}
        amount={winAmount}
        duration={3500}
      />
    </div>
  )
}
