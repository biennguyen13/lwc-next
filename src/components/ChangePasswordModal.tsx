"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/stores"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorCode: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const { user, changePassword } = useAuthStore()

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorCode: ""
      })
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      })
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (!formData.currentPassword) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mật khẩu hiện tại",
          variant: "destructive"
        })
        return
      }

      if (!formData.newPassword) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mật khẩu mới",
          variant: "destructive"
        })
        return
      }

      if (formData.newPassword.length < 6) {
        toast({
          title: "Lỗi",
          description: "Mật khẩu mới phải có ít nhất 6 ký tự",
          variant: "destructive"
        })
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Lỗi",
          description: "Mật khẩu xác nhận không khớp",
          variant: "destructive"
        })
        return
      }

      if (user?.is_two_fa && !formData.twoFactorCode) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mã 2FA",
          variant: "destructive"
        })
        return
      }

      if (formData.twoFactorCode && formData.twoFactorCode.length !== 6) {
        toast({
          title: "Lỗi",
          description: "Mã 2FA phải có 6 chữ số",
          variant: "destructive"
        })
        return
      }

      // Prepare change password data
      const changePasswordData: {
        current_password: string
        new_password: string
        two_fa_token?: string
      } = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      }

      // Add 2FA token if provided
      if (formData.twoFactorCode) {
        changePasswordData.two_fa_token = formData.twoFactorCode
      }

      await changePassword(changePasswordData)
      
      toast({
        title: "Thành công",
        description: "Đổi mật khẩu thành công",
        variant: "success"
      })
      
      onSuccess?.()
      onClose()
      
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Đổi mật khẩu thất bại",
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
        <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Đổi mật khẩu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Xác nhận Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA Code - Only show if 2FA is enabled */}
              {user?.is_two_fa && (
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Xác thực Google</Label>
                  <Input
                    type="text"
                    value={formData.twoFactorCode}
                    onChange={(e) => handleInputChange("twoFactorCode", e.target.value)}
                    placeholder="Nhập mã 6 số từ Google Authenticator"
                    className="bg-gray-800 border-gray-600 text-white"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
