"use client"

interface WalletTabsProps {
  activeTab: "main" | "trading"
  onTabChange: (tab: "main" | "trading") => void
}

export function WalletTabs({ activeTab, onTabChange }: WalletTabsProps) {
  return (
    <div className="flex space-x-8 border-b">
      <button
        onClick={() => onTabChange("main")}
        className={`pb-3 px-1 text-lg font-medium transition-colors ${
          activeTab === "main"
            ? "text-orange-500 border-b-2 border-orange-500"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
      >
        Ví Chính
      </button>
      
      <button
        onClick={() => onTabChange("trading")}
        className={`pb-3 px-1 text-lg font-medium transition-colors ${
          activeTab === "trading"
            ? "text-orange-500 border-b-2 border-orange-500"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
      >
        Ví giao dịch
      </button>
    </div>
  )
}

