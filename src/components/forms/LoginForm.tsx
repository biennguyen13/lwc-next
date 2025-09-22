"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useAuthStore } from "@/stores"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)
  const [twoFactorToken, setTwoFactorToken] = useState("")
  
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()

  // Pre-fill email from sessionStorage (from email verification)
  useEffect(() => {
    const prefilledEmail = sessionStorage.getItem('prefilledEmail')
    if (prefilledEmail) {
      setEmail(prefilledEmail)
      // Clear the prefilled email after using it
      sessionStorage.removeItem('prefilledEmail')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      const loginData = {
        email,
        password,
        remember_me: rememberMe,
        ...(requires2FA && { twoFactorToken })
      }
      
      await login(loginData)
      
      // Show success message
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
      })
      
      // Call success callback
      onSuccess?.()
      
    } catch (error: any) {
      const data = error.response?.data

      if(data?.requires2FA) {
        setRequires2FA(true)
        toast({
          title: "Yêu cầu mã xác thực 2FA",
          description: "Vui lòng nhập mã xác thực 2FA",
        })
        return
      }
      else {
        toast({
          title: "Đăng nhập thất bại",
          description: data?.message || "Vui lòng kiểm tra lại thông tin đăng nhập",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Đăng nhập vào tài khoản của bạn</h2>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {/* 2FA Token Input - Only show when 2FA is required */}
        {requires2FA && (
          <div className="space-y-2">
            <Label htmlFor="twoFactorToken" className="text-white">Mã xác thực 2FA</Label>
            <Input
              id="twoFactorToken"
              type="text"
              placeholder="Nhập mã xác thực 2FA"
              value={twoFactorToken}
              onChange={(e) => setTwoFactorToken(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white h-12"
              required
            />
            <p className="text-xs text-gray-400">
              Vui lòng nhập mã 6 chữ số từ ứng dụng xác thực của bạn
            </p>
          </div>
        )}

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
            />
            <Label htmlFor="remember" className="text-sm text-gray-300">
              Ghi nhớ đăng nhập
            </Label>
          </div>
          <Button variant="link" className="p-0 h-auto text-sm text-orange-500">
            Quên mật khẩu?
          </Button>
        </div>

        <div className="my-8"/>

        {/* Login Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isLoading}
        >
          {isLoading 
            ? "Đang đăng nhập..." 
            : requires2FA 
              ? "Xác thực 2FA" 
              : "Đăng nhập"
          }
        </Button>

        {/* Back to login button when 2FA is required */}
        {requires2FA && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-600 text-white hover:bg-gray-700"
            onClick={() => {
              setRequires2FA(false)
              setTwoFactorToken("")
              clearError()
            }}
          >
            Quay lại đăng nhập
          </Button>
        )}

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

        {/* Register Link */}
        <div className="text-center text-sm">
          <span className="text-gray-400">Chưa có tài khoản? </span>
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm text-orange-500"
            onClick={onSwitchToRegister}
          >
            Đăng ký ngay
          </Button>
        </div>
      </form>
    </div>
  )
}
