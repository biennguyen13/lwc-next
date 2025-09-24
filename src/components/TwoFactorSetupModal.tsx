"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Copy, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useTwoFactorStore } from "@/stores"

interface TwoFactorSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TwoFactorSetupModal({ isOpen, onClose, onSuccess }: TwoFactorSetupModalProps) {
  const [formData, setFormData] = useState({
    password: "",
    emailCode: "",
    twoFactorCode: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false)

  const { 
    setupData, 
    isLoading: isSetupLoading, 
    error: setupError,
    getSetupData,
    setup2FA,
    sendVerificationEmail,
    clearError,
  } = useTwoFactorStore()

  // Load setup data when modal opens
  useEffect(() => {
    if (isOpen) {
      getSetupData()
    }
  }, [isOpen, ])

  // Clear error when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearError()
      setFormData({
        password: "",
        emailCode: "",
        twoFactorCode: ""
      })
      setIsEmailCodeSent(false)
    }
  }, [isOpen, clearError])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret)
      toast({
        title: "Đã sao chép",
        description: "Mã sao lưu đã được sao chép vào clipboard"
      })
    }
  }

  const handleSendEmailCode = async () => {
    try {
        toast({
            title: "Đang gửi...",
            description: "Đang gửi mã xác nhận đến email của bạn"
        })
          
      await sendVerificationEmail()
      
      toast({
        title: "Thành công",
        description: "Đã gửi mã xác nhận đến email của bạn"
      })
      
      setIsEmailCodeSent(true)
      
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Gửi email thất bại",
        variant: "destructive"
      })
    }
  }

  const handlePaste = (field: string) => {
    navigator.clipboard.readText().then(text => {
      handleInputChange(field, text)
    }).catch(() => {
      toast({
        title: "Lỗi",
        description: "Không thể đọc clipboard",
        variant: "destructive"
      })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!setupData?.secret) {
      toast({
        title: "Lỗi",
        description: "Chưa có dữ liệu setup 2FA",
        variant: "destructive"
      })
      return
    }

    // Validation
    if (!formData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu",
        variant: "destructive"
      })
      return
    }

    if (!formData.emailCode) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã xác nhận email",
        variant: "destructive"
      })
      return
    }

    if (!formData.twoFactorCode) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã 2FA",
        variant: "destructive"
      })
      return
    }

    if (formData.twoFactorCode.length !== 6) {
      toast({
        title: "Lỗi",
        description: "Mã 2FA phải có 6 chữ số",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      await setup2FA(
        setupData.secret, 
        formData.twoFactorCode, 
        formData.password, 
        formData.emailCode
      )
      
      toast({
        title: "Thành công",
        description: "Đã bật xác thực 2 bước thành công"
      })
      
      onSuccess()
      onClose()
      
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Setup 2FA thất bại",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Bật xác thực 2 bước</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Instructions */}
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-red-200 text-sm">
                Mở ứng dụng Google Authenticator của bạn và quét mã QR bên dưới hoặc nhập khóa vào ứng dụng. 
                Khóa này dùng để khôi phục Xác thực Google của bạn khi bạn đổi hoặc mất điện thoại. 
                Vui lòng sao lưu khóa này trước khi kích hoạt Xác thực Google.
              </p>
            </div>

            {/* QR Code */}
            {setupData?.qr_code && (
              <div className="flex justify-center">
                <img 
                  src={setupData.qr_code} 
                  alt="QR Code" 
                  className="w-48 h-48 border border-gray-600 rounded-lg"
                />
              </div>
            )}

            {/* Backup Code */}
            {setupData?.secret && (
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Mã sao lưu:</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={setupData.secret}
                    readOnly
                    className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Email Confirmation Code */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Mã Xác nhận Email</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={formData.emailCode}
                    onChange={(e) => handleInputChange("emailCode", e.target.value)}
                    placeholder="Mã Xác nhận"
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePaste("emailCode")}
                    className="border-gray-600 text-blue-400 hover:bg-gray-700"
                  >
                    Paste
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSendEmailCode}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isEmailCodeSent || isSetupLoading}
                  >
                    {isSetupLoading ? "Đang gửi..." : isEmailCodeSent ? "Đã gửi" : "Gửi Mã"}
                  </Button>
                </div>
              </div>

              {/* 2FA Code */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Mã 2FA</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={formData.twoFactorCode}
                    onChange={(e) => handleInputChange("twoFactorCode", e.target.value)}
                    placeholder="Nhập mã 6 số từ ứng dụng"
                    className="bg-gray-800 border-gray-600 text-white"
                    maxLength={6}
                    required
                    pattern="[0-9]{6}"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePaste("twoFactorCode")}
                    className="border-gray-600 text-blue-400 hover:bg-gray-700"
                  >
                    Paste
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || isSetupLoading || !setupData}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isLoading ? "Đang xử lý..." : "Bật"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )

  // Portal modal to body
  return createPortal(modalContent, document.body)
}
