"use client"

import { useState } from "react"
import { LoginForm } from "@/components/forms/LoginForm"
import { RegisterForm } from "@/components/forms/RegisterForm"

interface AuthSidebarModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "login" | "register"
}

export function AuthSidebarModal({ isOpen, onClose, defaultMode = "login" }: AuthSidebarModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  const handleSuccess = () => {
    onClose()
    // Reset mode to default for next time
    setMode(defaultMode)
  }

  const handleSwitchToLogin = () => {
    setMode("login")
  }

  const handleSwitchToRegister = () => {
    setMode("register")
  }

  return (
    <div className="h-full flex flex-col py-6 px-10">
      {/* Logo */}
      <div className="-ml-6">
        <img
          src="/finantex-logo.png"
          alt="FinanTex Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 flex justify-center items-center">
        {mode === "login" ? (
          <LoginForm 
            onSuccess={handleSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>

      {/* Footer Links */}
      {/* <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="space-y-3 text-sm">
          {mode === "login" ? (
            <>
              <div className="text-center">
                <span className="text-gray-400">Cần tài khoản FINANTEX? </span>
                <button 
                  onClick={handleSwitchToRegister}
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
              <div className="text-center">
                <button className="text-white hover:text-gray-300 transition-colors">
                  Không nhận được email xác nhận? Yêu cầu một email mới
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <span className="text-gray-400">Đã có tài khoản? </span>
              <button 
                onClick={handleSwitchToLogin}
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}
        </div>
      </div> */}
    </div>
  )
}
