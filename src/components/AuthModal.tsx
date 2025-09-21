"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { LoginForm } from "@/components/forms/LoginForm"
import { RegisterForm } from "@/components/forms/RegisterForm"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
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

  const handleClose = () => {
    onClose()
    // Reset mode to default for next time
    setMode(defaultMode)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader className="relative">
          <DialogTitle className="sr-only">
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </DialogHeader>
        
        <div className="px-1">
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
      </DialogContent>
    </Dialog>
  )
}
