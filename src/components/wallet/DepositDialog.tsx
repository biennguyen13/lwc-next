"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useWalletStore } from "@/stores"
import QRCode from "qrcode"
import { USDTIcon } from "@/components/ui/usdt-icon"

interface DepositDialogProps {
  isOpen: boolean
  onClose: () => void
  currency: string
}

export function DepositDialog({ isOpen, onClose, currency }: DepositDialogProps) {
  const [amount, setAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [depositAddress, setDepositAddress] = useState("")
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  
  const { depositAddresses, fetchMyDepositAddresses, depositAddressesLoading } = useWalletStore()

  // Fetch deposit addresses when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingAddress(true)
      fetchMyDepositAddresses().finally(() => setIsLoadingAddress(false))
    }
  }, [isOpen, fetchMyDepositAddresses])

  // Set deposit address when addresses are loaded
  useEffect(() => {
    if (depositAddresses.length > 0) {
      // Find USDT address or use first available address
      const usdtAddress = depositAddresses.find(addr => addr.token_symbol === 'USDT')
      const selectedAddress = usdtAddress || depositAddresses[0]
      setDepositAddress(selectedAddress.address)
    }
  }, [depositAddresses])

  // Generate QR code when deposit address changes
  useEffect(() => {
    if (depositAddress) {
      QRCode.toDataURL(depositAddress, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeDataUrl).catch(console.error)
    }
  }, [depositAddress])


  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Nạp tiền {currency}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Network Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mạng Lưới</Label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                disabled
              >
                BEP20 (BSC)
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Chú ý:</strong> Để đảm bảo an toàn cho tài sản của bạn, xin hãy xác nhận lần nữa blockchain bạn cần dùng là BSC.
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-4">
              {isLoadingAddress || depositAddressesLoading ? (
                <div className="text-center text-gray-500">
                  <div className="w-32 h-32 bg-gray-200 rounded animate-pulse"></div>
                  <p className="text-xs mt-2">Đang tải địa chỉ ví...</p>
                </div>
              ) : qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="w-32 h-32 bg-gray-200 rounded animate-pulse"></div>
                  <p className="text-xs mt-2">Đang tạo QR Code...</p>
                </div>
              )}
            </div>
          </div>

          {/* Deposit Address */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Địa chỉ ví</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={isLoadingAddress || depositAddressesLoading ? "Đang tải..." : depositAddress}
                readOnly
                className="font-mono text-sm bg-gray-50 dark:bg-gray-700"
                disabled={isLoadingAddress || depositAddressesLoading}
              />
              <Button 
                size="sm" 
                onClick={copyAddress}
                disabled={isLoadingAddress || depositAddressesLoading || !depositAddress}
                className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Minimum Amount */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Số tiền tối thiểu 5$
            </p>
          </div>

          {/* Important Note */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Lưu ý:</strong> Địa chỉ ví có thể bị thay đổi sau mỗi lần nạp. Vui lòng xác nhận lại địa chỉ nạp 1 lần nữa để tránh mất tài sản.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Đóng
            </Button>
            <Button 
              onClick={copyAddress}
              disabled={isLoadingAddress || depositAddressesLoading || !depositAddress}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              {copied ? 'Đã sao chép!' : 'Sao chép'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
