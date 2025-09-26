"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useTwoFactorStore } from "@/stores"

interface TwoFactorDisableModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TwoFactorDisableModal({ isOpen, onClose, onSuccess }: TwoFactorDisableModalProps) {
  const [formData, setFormData] = useState({
    password: "",
    emailCode: "",
    twoFactorCode: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false)

  const { 
    isLoading: isDisableLoading, 
    error: disableError,
    disable2FA,
    sendVerificationEmail,
    clearError
  } = useTwoFactorStore()

  // Clear error when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearError()
      setIsEmailCodeSent(false)
      setFormData({ password: "", emailCode: "", twoFactorCode: "" })
    }
  }, [isOpen, clearError])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSendEmailCode = async () => {
    try {
      toast({
        title: "Đang gửi...",
        description: "Đang gửi mã xác nhận đến email của bạn"
      })
        
      await sendVerificationEmail('turn-off')
      
      toast({
        title: "Thành công",
        description: "Đã gửi mã xác nhận đến email của bạn",
        variant: "success"
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
        description: "Không thể dán từ clipboard",
        variant: "destructive"
      })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      await disable2FA(
        formData.twoFactorCode, 
        formData.password, 
        formData.emailCode
      )
      
      toast({
        title: "Thành công",
        description: "Đã tắt xác thực 2 bước thành công",
        variant: "success"
      })
      
      onSuccess()
      onClose()
      
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Tắt 2FA thất bại",
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
            <h2 className="text-xl font-bold text-white">Xác thực Google</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Instructions */}
            <p className="text-gray-300 text-sm">
              Google Authenticator đã được bật. Để hủy kích hoạt, nhập mã Google Authenticator và nhấn Hủy kích hoạt.
            </p>

            {/* Form for verification */}
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
                    disabled={isEmailCodeSent || isDisableLoading}
                  >
                    {isDisableLoading ? "Đang gửi..." : isEmailCodeSent ? "Đã gửi" : "Gửi Mã"}
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
                size="lg"
                className="w-full bg-gray-700 hover:bg-gray-500 text-white font-medium mt-6"
                disabled={isLoading || isDisableLoading}
              >
                {isLoading ? "Đang xử lý..." : "Hủy kích hoạt"}
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
