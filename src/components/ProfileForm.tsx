"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useTwoFactorStore, useAuthStore } from "@/stores"
import { TwoFactorSetupModal } from "@/components/TwoFactorSetupModal"
import { TwoFactorDisableModal } from "@/components/TwoFactorDisableModal"
import { User as UserType } from "@/types"

interface ProfileFormProps {
  user: UserType | null
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    nickname: user?.nickname || "",
    avatar: user?.avatar || ""
  })
  const [twoFAToken, setTwoFAToken] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHideSensitiveData, setIsHideSensitiveData] = useState(false)
  const [is2FASetupModalOpen, setIs2FASetupModalOpen] = useState(false)
  const [is2FADisableModalOpen, setIs2FADisableModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 2FA Store
  const { 
    isEnabled: is2FAEnabled, 
    isLoading: is2FALoading, 
    error: twoFactorError,
    getStatus,
    setup2FA,
    disable2FA,
    clearError
  } = useTwoFactorStore()

  const { fetchProfile, updateProfile, isLoading: isAuthLoading } = useAuthStore()

  // Load 2FA status on component mount
  useEffect(() => {
    getStatus()
  }, [getStatus])

  // Clear 2FA error when component unmounts
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn file ảnh hợp lệ",
          variant: "destructive"
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "Kích thước file không được vượt quá 5MB",
          variant: "destructive"
        })
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation: Check if 2FA is required
      if (user?.is_two_fa && !twoFAToken) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mã 2FA để cập nhật thông tin",
          variant: "destructive"
        })
        return
      }

      // Prepare update data
      const updateData: {
        first_name?: string
        last_name?: string
        two_fa_token?: string
      } = {
        first_name: formData.firstName,
        last_name: formData.lastName
      }

      // Add 2FA token if provided
      if (twoFAToken) {
        updateData.two_fa_token = twoFAToken
      }

      await updateProfile(updateData)
      
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành công",
        variant: "success"
      })
      
      // Clear 2FA token after successful update
      setTwoFAToken("")
      
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Cập nhật thất bại",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    toast({
      title: "Thông báo",
      description: "Chức năng đổi mật khẩu sẽ được triển khai sớm"
    })
  }

  const handle2FAToggle = async () => {
    if (is2FAEnabled) {
      // Disable 2FA - mở disable modal
      setIs2FADisableModalOpen(true)
    } else {
      // Enable 2FA - mở setup modal
      setIs2FASetupModalOpen(true)
    }
  }

  const handle2FASetupSuccess = async () => {
    await getStatus()
    await fetchProfile()
    toast({
      title: "Thành công",
      description: "Đã bật xác thực 2 bước thành công"
    })
  }

  const handle2FADisableSuccess = async () => {
    await getStatus()
    await fetchProfile()
    toast({
      title: "Thành công",
      description: "Đã tắt xác thực 2 bước thành công"
    })
  }

  return (
    <div className="space-y-8">
      {/* Profile Information Section */}
      <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Thông tin cá nhân</h2>
      <div className="border-t border-gray-600 mb-6"></div>
        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-orange-500 hover:bg-orange-600 text-gray-200 px-6 py-2 rounded-lg"
          >
            <Camera className="w-4 h-4 mr-2" />
            Thay ảnh
          </Button>
        </div>

        {/* Form Fields - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
                Địa chỉ Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-800 border-gray-600 text-gray-300 h-12 rounded-lg"
                disabled
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-200 text-sm font-medium">
                Tên
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Nhập tên của bạn"
                disabled={!user?.is_two_fa}
                className="bg-gray-800 border-gray-600 text-gray-200 h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {!user?.is_two_fa && (
                <p className="text-red-500 text-xs">* Bạn phải bật 2FA để điều chỉnh</p>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-200 text-sm font-medium">
                Biệt danh
              </Label>
              <Input
                id="nickname"
                type="text"
                disabled
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="Nhập biệt danh"
                className="bg-gray-800 border-gray-600 text-gray-200 h-12 rounded-lg"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-200 text-sm font-medium">
                Họ
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Nhập họ của bạn"
                disabled={!user?.is_two_fa}
                className="bg-gray-800 border-gray-600 text-gray-200 h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {!user?.is_two_fa && (
                <p className="text-red-500 text-xs">* Bạn phải bật 2FA để điều chỉnh</p>
              )}
            </div>

            {/* 2FA Token - Only show if 2FA is enabled */}
            {user?.is_two_fa && (
              <div className="space-y-2">
                <Label htmlFor="twoFAToken" className="text-gray-200 text-sm font-medium">
                  Mã 2FA
                </Label>
                <Input
                  id="twoFAToken"
                  type="text"
                  value={twoFAToken}
                  onChange={(e) => setTwoFAToken(e.target.value)}
                  placeholder="Nhập mã 2FA để cập nhật thông tin"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="bg-gray-800 border-gray-600 text-gray-200 h-12 rounded-lg"
                />
                <p className="text-gray-400 text-xs">Nhập mã 6 số từ ứng dụng Google Authenticator</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isLoading || isAuthLoading}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-8 py-3 rounded-lg font-medium"
          >
            {isLoading || isAuthLoading ? "Đang cập nhật..." : "Cập nhật Tài khoản"}
          </Button>
        </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Bảo mật</h2>
        <div className="border-t border-gray-600 mb-6"></div>
        
        <div className="space-y-8">
          {/* Password Management */}
          <div className="flex items-start justify-between">
            <div className="flex-1 flex">
              <div className="flex items-center space-x-4 mb-3 flex-shrink-0">
                <Label className="text-gray-200 text-sm font-medium">Mật khẩu:</Label>
                <p className="text-gray-400 text-sm">
                  Bạn có muốn thay đổi mật khẩu không? Nhấp vào nút phía dưới để thay đổi.
                </p>
              </div>
              <div className="flex flex-col items-end flex-1">
                <Button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={!user?.is_two_fa}
                  className="bg-orange-500 hover:bg-orange-600 text-gray-200 px-4 py-2 rounded-lg mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đổi mật khẩu
                </Button>
                {!user?.is_two_fa && (
                  <p className="text-red-500 text-xs">* Bạn phải bật 2FA để điều chỉnh</p>
                )}
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <Label className="text-gray-200 text-sm font-medium">Mã 2FA:</Label>
                <p className="text-gray-400 text-sm">
                  Bắt buộc để rút tiền hoặc cập nhật các bảo mật.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-200 text-sm">{is2FAEnabled ? 'On' : 'Off'}</span>
              <button
                type="button"
                onClick={handle2FAToggle}
                disabled={is2FALoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                  is2FAEnabled ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  is2FAEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Hide Sensitive Data */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <Label className="text-gray-200 text-sm font-medium">Ẩn dữ liệu nhạy cảm:</Label>
                <p className="text-gray-400 text-sm">
                  Bật cài đặt này để ẩn thông tin thống kê tài khoản của bạn.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-200 text-sm">{isHideSensitiveData ? 'On' : 'Off'}</span>
              <button
                type="button"
                onClick={() => setIsHideSensitiveData(!isHideSensitiveData)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  isHideSensitiveData ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isHideSensitiveData ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      <TwoFactorSetupModal
        isOpen={is2FASetupModalOpen}
        onClose={() => setIs2FASetupModalOpen(false)}
        onSuccess={handle2FASetupSuccess}
      />

      {/* 2FA Disable Modal */}
      <TwoFactorDisableModal
        isOpen={is2FADisableModalOpen}
        onClose={() => setIs2FADisableModalOpen(false)}
        onSuccess={handle2FADisableSuccess}
      />
    </div>
  )
}
