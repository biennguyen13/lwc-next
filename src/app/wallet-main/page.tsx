"use client"

import { useState, useEffect } from "react"
import { WalletHeader } from "@/components/wallet/WalletHeader"
import { WalletTabs } from "@/components/wallet/WalletTabs"
import { WalletCard } from "@/components/wallet/WalletCard"
import { TransactionHistory } from "@/components/wallet/TransactionHistory"
import { DepositDialog } from "@/components/wallet/DepositDialog"
import { WithdrawDialog } from "@/components/wallet/WithdrawDialog"
import { useWalletStore } from "@/stores"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Shield, Zap } from "lucide-react"

export default function WalletMainPage() {
  const [activeWalletTab, setActiveWalletTab] = useState<"main" | "trading">("main")
  const [activeHistoryTab, setActiveHistoryTab] = useState<"usdt" | "commission">("usdt")
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)

  const { 
    balance, 
    balanceSummary,
    deposits, 
    withdrawals,
    balanceLoading, 
    depositsLoading,
    withdrawalsLoading,
    fetchBalance, 
    fetchBalanceSummary,
    fetchDeposits,
    fetchWithdrawals,
    refreshDeposits,
    refreshWithdrawals
  } = useWalletStore()

  // Fetch data on component mount
  useEffect(() => {
    fetchBalanceSummary()
    fetchDeposits()
    fetchWithdrawals()
  }, [fetchBalanceSummary, fetchDeposits, fetchWithdrawals])

  // Auto-refresh data every 15 seconds (without loading states to prevent UI flicker)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDeposits()
      refreshWithdrawals()
    }, 15000) // 15 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Calculate stats
  const totalDeposits = deposits?.reduce((sum, deposit) => sum + parseFloat(deposit.amount || '0'), 0) || 0
  const totalWithdrawals = withdrawals?.reduce((sum, withdrawal) => sum + parseFloat(withdrawal.amount || '0'), 0) || 0
  const netFlow = totalDeposits - totalWithdrawals

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <div className="mx-auto p-4 bg-orange-400 "> 
        {/* Wallet Header */}
        <WalletHeader
          className="max-w-6xl mx-auto p-4"
          totalBalance={parseFloat(balanceSummary.real.tokens.USDT.total_balance) + parseFloat(balanceSummary.real.tokens.USDT.usdt_wallet) || 0}
        />
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Wallet Tabs */}
        <div className="mt-6">
          <WalletTabs 
            activeTab={activeWalletTab}
            onTabChange={setActiveWalletTab}
          />
        </div>

        {/* Wallet Content */}
        <div className="mt-6">
          {activeWalletTab === "main" && (
              <WalletCard 
                currency="USDT"
                currencyName="Tether"
                balance={
                  balanceSummary?.real?.tokens?.USDT?.total_balance 
                    ? parseFloat(balanceSummary.real.tokens.USDT.total_balance) 
                    : 0
                }
                usdValue={balanceSummary?.real?.tokens?.USDT?.total_usd || 0}
                onDeposit={() => setIsDepositDialogOpen(true)}
                onWithdraw={() => setIsWithdrawDialogOpen(true)}
              />
          )}
          
          {activeWalletTab === "trading" && (
            <div className="text-center py-8 text-gray-400">
              Trading wallet content coming soon...
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <TransactionHistory 
            activeTab={activeHistoryTab}
            onTabChange={setActiveHistoryTab}
          />
        </div>
      </div>

      {/* Dialogs */}
      <DepositDialog
        isOpen={isDepositDialogOpen}
        onClose={() => setIsDepositDialogOpen(false)}
        currency="USDT"
      />
      
      <WithdrawDialog
        isOpen={isWithdrawDialogOpen}
        onClose={() => setIsWithdrawDialogOpen(false)}
        currency="USDT"
        availableBalance={
          balanceSummary?.real?.tokens?.USDT?.available_balance 
            ? parseFloat(balanceSummary.real.tokens.USDT.available_balance) 
            : 0
        }
      />
    </div>
  )
}
