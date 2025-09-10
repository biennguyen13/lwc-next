"use client"

import { useState, useEffect } from "react"
import { WalletHeader } from "@/components/wallet/WalletHeader"
import { WalletTabs } from "@/components/wallet/WalletTabs"
import { WalletCard } from "@/components/wallet/WalletCard"
import { TransactionHistory } from "@/components/wallet/TransactionHistory"
import { DepositDialog } from "@/components/wallet/DepositDialog"
import { WithdrawDialog } from "@/components/wallet/WithdrawDialog"
import { useWalletStore } from "@/stores"

export default function WalletMainPage() {
  const [activeWalletTab, setActiveWalletTab] = useState<"main" | "trading">("main")
  const [activeHistoryTab, setActiveHistoryTab] = useState<"usdt" | "commission">("usdt")
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
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
    fetchWithdrawals
  } = useWalletStore()

  // Fetch data on component mount
  useEffect(() => {
    fetchBalanceSummary()
    fetchDeposits()
    fetchWithdrawals()
  }, [fetchBalanceSummary, fetchDeposits, fetchWithdrawals])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto p-4">
        {/* Wallet Header */}
        <WalletHeader 
          totalBalance={balanceSummary?.total_balance_usd || 0}
          isBalanceHidden={isBalanceHidden}
          onToggleBalance={() => setIsBalanceHidden(!isBalanceHidden)}
        />

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
              balance={balanceSummary?.tokens?.USDT?.total_balance ? parseFloat(balanceSummary.tokens.USDT.total_balance) : 0}
              usdValue={balanceSummary?.tokens?.USDT?.total_usd || 0}
              onDeposit={() => setIsDepositDialogOpen(true)}
              onWithdraw={() => setIsWithdrawDialogOpen(true)}
            />
          )}
          
          {activeWalletTab === "trading" && (
            <div className="text-center py-8 text-gray-500">
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
        availableBalance={balanceSummary?.tokens?.USDT?.available_balance ? parseFloat(balanceSummary.tokens.USDT.available_balance) : 0}
      />
    </main>
  )
}
