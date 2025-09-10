"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { USDTIcon } from "@/components/ui/usdt-icon"
import { useWalletStore } from "@/stores"

interface WithdrawDialogProps {
  isOpen: boolean
  onClose: () => void
  currency: string
  availableBalance: number
}

export function WithdrawDialog({ isOpen, onClose, currency, availableBalance }: WithdrawDialogProps) {
  const [amount, setAmount] = useState("")
  const [receiverNickname, setReceiverNickname] = useState("")
  const [memo, setMemo] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState<"internal" | "bep20">("internal")
  
  const { createWithdrawal } = useWalletStore()

  const handleWithdraw = async () => {
    try {
      // For internal transfers, we might need different API
      if (selectedNetwork === "internal") {
        // TODO: Implement internal transfer API
        console.log('Internal transfer:', { amount, receiverNickname, memo })
      } else {
        await createWithdrawal({
          tokenSymbol: currency as 'USDT',
          amount: parseFloat(amount),
          toAddress: receiverNickname, // For BEP20, this would be the wallet address
        })
      }
      
      // Show success message
      console.log('Withdrawal request created successfully')
      onClose()
      // Reset form
      setAmount("")
      setReceiverNickname("")
      setMemo("")
    } catch (error) {
      console.error('Withdrawal error:', error)
    }
  }

  const handleMaxAmount = () => {
    setAmount(availableBalance.toString())
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setMemo(text)
    } catch (error) {
      console.error('Failed to paste:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Rút tiền {currency}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <USDTIcon size={24} />
              <Label htmlFor="amount" className="text-sm font-medium">
                Số tiền
              </Label>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          {/* Network Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mạng Lưới</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedNetwork("internal")}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedNetwork === "internal"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="text-left">
                  <div className="font-medium text-sm">Nội bộ</div>
                  <div className="text-xs text-gray-500 mt-1">Phí: 0 USDT</div>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedNetwork("bep20")}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedNetwork === "bep20"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="text-left">
                  <div className="font-medium text-sm">BEP20 (BSC)</div>
                  <div className="text-xs text-gray-500 mt-1">Phí: 1 USDT</div>
                </div>
              </button>
            </div>
          </div>

          {/* USDT Value */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Giá trị USDT</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMaxAmount}
                className="text-xs"
              >
                Max
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Số tiền tối thiểu: 5 USDT
            </div>
          </div>

          {/* Receiver Nickname */}
          <div className="space-y-2">
            <Label htmlFor="receiverNickname" className="text-sm font-medium">
              ReceiverNickname
            </Label>
            <Input
              id="receiverNickname"
              placeholder="ReceiverNickname"
              value={receiverNickname}
              onChange={(e) => setReceiverNickname(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="memo" className="text-sm font-medium">
              Ghi chú (Không bắt buộc)
            </Label>
            <div className="flex space-x-2">
              <Textarea
                id="memo"
                placeholder="Nhập ghi chú của bạn"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={3}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePaste}
                className="self-start"
              >
                Paste
              </Button>
            </div>
          </div>

          {/* 2FA Warning */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              Bạn phải bật 2FA để yêu cầu rút tiền
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button 
              onClick={handleWithdraw} 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
              disabled={!amount || !receiverNickname || parseFloat(amount) < 5 || parseFloat(amount) > availableBalance}
            >
              Gửi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
