"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle, XCircle, X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getIcon = (variant?: string) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
      case "destructive":
        return <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
      default:
        return <AlertCircle className="h-6 w-6 text-blue-500 flex-shrink-0" />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start space-x-4">
              {getIcon(variant)}
              <div className="flex-1 min-w-0">
                {title && <ToastTitle className="text-white font-medium">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-gray-300 mt-1">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
