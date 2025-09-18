"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { USDTIcon } from "@/components/ui/usdt-icon"
import { Check, Copy } from "lucide-react"
import { useWalletStore } from "@/stores"
import { useToast } from "@/hooks/use-toast"

interface WithdrawDialogProps {
  isOpen: boolean
  onClose: () => void
  currency: string
  availableBalance: number
}

export function WithdrawDialog({ isOpen, onClose, currency, availableBalance }: WithdrawDialogProps) {
  const [amount, setAmount] = useState("")
  const [receiverAddress, setReceiverAddress] = useState("")
  const [memo, setMemo] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState<"internal" | "bep20">("bep20")
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { createWithdrawal } = useWalletStore()
  const { toast } = useToast()

  const handleWithdraw = async () => {
    if (isSubmitting) return // Prevent multiple clicks
    
    setIsSubmitting(true)
    
    try {
      // For internal transfers, we might need different API
      if (selectedNetwork === "internal") {
        // TODO: Implement internal transfer API
        console.log('Internal transfer:', { amount, receiverAddress, memo, twoFactorCode })
        
        // Show success toast for internal transfer
        toast({
          title: "Thành công",
          description: "Yêu cầu chuyển nội bộ đã được gửi",
          variant: "default",
        })
      } else {
        await createWithdrawal({
          tokenSymbol: currency as 'USDT',
          amount: parseFloat(amount),
          toAddress: receiverAddress, // For BEP20, this would be the wallet address
          twoFactorToken: twoFactorCode,
          memo: memo
        })
        
        // Show success toast for BEP20 withdrawal
        toast({
          title: "Thành công",
          description: "Yêu cầu rút tiền BEP20 đã được gửi thành công",
          variant: "default",
        })
      }
      
      // Only close dialog after successful request
      onClose()
      // Reset form
      setAmount("")
      setReceiverAddress("")
      setMemo("")
      setTwoFactorCode("")
    } catch (error) {
      console.error('Withdrawal error:', error)
      
      // Show error toast
      toast({
        title: "Lỗi",
        description: error.response?.data?.error  || "Có lỗi xảy ra khi rút tiền",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMaxAmount = () => {
    setAmount(availableBalance.toString())
  }

  const handlePaste = async (target: 'memo' | 'address' | '2fa') => {
    try {
      const text = await navigator.clipboard.readText()
      switch (target) {
        case 'memo':
          setMemo(text)
          break
        case 'address':
          setReceiverAddress(text)
          break
        case '2fa':
          setTwoFactorCode(text)
          break
      }
    } catch (error) {
      console.error('Failed to paste:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Rút tiền {currency}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Nhập thông tin để rút tiền từ ví của bạn
          </DialogDescription>
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
            <div className="flex items-center space-x-2">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-medium flex-1"
              />
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

          {/* Network Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mạng Lưới</Label>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedNetwork("internal")}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
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
                className={`flex-1 p-3 rounded-lg border-2 transition-colors relative ${
                  selectedNetwork === "bep20"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="text-left">
                  <div className="font-medium text-sm">BEP20 (BSC)</div>
                  <div className="text-xs text-gray-500 mt-1">Phí: 1 USDT</div>
                </div>
                {selectedNetwork === "bep20" && (
                  <Check className="w-4 h-4 text-blue-500 absolute top-2 right-2" />
                )}
              </button>
            </div>
            
            {/* Network Warning - Only for BEP20 */}
            {selectedNetwork === "bep20" && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Chú ý:</strong> Để đảm bảo an toàn cho tài sản của bạn, xin hãy xác nhận lần nữa blockchain bạn cần dùng là BSC.
                </p>
              </div>
            )}
          </div>

          {/* Conditional UI based on selected network */}
          {selectedNetwork === "internal" ? (
            <>
              {/* Internal Transfer - Receiver Nickname */}
              <div className="space-y-2">
                <Label htmlFor="receiverNickname" className="text-sm font-medium">
                  ReceiverNickname
                </Label>
                <Input
                  id="receiverNickname"
                  placeholder="ReceiverNickname"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  className="flex-1"
                />
              </div>

              {/* Internal Transfer - Memo */}
              <div className="space-y-2">
                <Label htmlFor="memo" className="text-sm font-medium">
                  Ghi chú (Không bắt buộc)
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="memo"
                    placeholder="Nhập ghi chú của bạn"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePaste('memo')}
                    className="text-xs"
                  >
                    Paste
                  </Button>
                </div>
              </div>

              {/* Internal Transfer - 2FA Code */}
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode" className="text-sm font-medium">
                  Mã 2FA
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="twoFactorCode"
                    placeholder="Mã 2FA"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePaste('2fa')}
                    className="text-xs"
                  >
                    Paste
                  </Button>
                </div>
                
                {/* 2FA Warning */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Bạn phải bật 2FA để yêu cầu rút tiền
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* BEP20 Transfer - Receiver Address */}
              <div className="space-y-2">
                <Label htmlFor="receiverAddress" className="text-sm font-medium">
                  Địa chỉ nhận
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="receiverAddress"
                    placeholder="Nhập địa chỉ nhận"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePaste('address')}
                    className="text-xs"
                  >
                    Paste
                  </Button>
                </div>
              </div>

              {/* BEP20 Transfer - Memo */}
              <div className="space-y-2">
                <Label htmlFor="memo" className="text-sm font-medium">
                  Ghi chú (Không bắt buộc)
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="memo"
                    placeholder="Nhập ghi chú của bạn"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePaste('memo')}
                    className="text-xs"
                  >
                    Paste
                  </Button>
                </div>
              </div>

              {/* BEP20 Transfer - 2FA Code */}
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode" className="text-sm font-medium">
                  Mã 2FA
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="twoFactorCode"
                    placeholder="Mã 2FA"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePaste('2fa')}
                    className="text-xs"
                  >
                    Paste
                  </Button>
                </div>
                
                {/* 2FA Warning */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Bạn phải bật 2FA để yêu cầu rút tiền
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <Button 
              onClick={handleWithdraw} 
              className="w-full bg-[#fc605f] hover:bg-red-600 text-white py-3 text-lg font-medium disabled:opacity-50"
              disabled={!amount || !receiverAddress || !twoFactorCode || parseFloat(amount) < 5 || parseFloat(amount) > availableBalance || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Gửi"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
