"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { authAPI } from "@/lib/api"

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }
    
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        first_name: "",
        last_name: "",
        nickname: formData.nickname,
        phone: "" // Empty phone
      })
      
      toast({
        title: "Đăng ký thành công",
        description: response.message || "Đăng ký thành công! Đã gửi mail xác thực đến email của bạn.",
      })
      
      // Show additional instruction
      setTimeout(() => {
        toast({
          title: "Kiểm tra email",
          description: "Vui lòng kiểm tra email và click vào link xác thực để hoàn tất đăng ký.",
        })
      }, 2000)
      
      onSuccess?.()
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Đăng ký thất bại"
      setError(errorMessage)
      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Đăng ký</h2>
        <p className="text-gray-400 mt-2">Tạo tài khoản mới để bắt đầu giao dịch</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nickname Input */}
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-white">Nickname</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="nickname"
              type="text"
              placeholder="Nhập nickname của bạn"
              value={formData.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white h-12"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white h-12"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white h-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">Xác nhận mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white h-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="my-8"/>

        {/* Register Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-2 text-gray-400">
              Hoặc
            </span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span className="text-gray-400">Đã có tài khoản? </span>
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm text-orange-500"
            onClick={onSwitchToLogin}
          >
            Đăng nhập ngay
          </Button>
        </div>
      </form>
    </div>
  )
}
