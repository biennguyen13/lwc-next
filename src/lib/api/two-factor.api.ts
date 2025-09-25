import { AxiosResponse } from "axios"
import apiClient from "../api"

// ==================== TWO FACTOR AUTH API ====================
export const twoFactorAPI = {
  // Lấy dữ liệu setup 2FA (QR code và secret)
  getSetupData: async (): Promise<{
    secret: string
    qr_code: string
    otpauth_url: string
  }> => {
    const response: AxiosResponse = await apiClient.get("/2fa/setup")
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy dữ liệu setup 2FA thất bại")
    return response.data.data
  },

  // Reset 2FA (tạo secret mới)
  reset2FA: async (): Promise<{
    secret: string
    qr_code: string
    otpauth_url: string
  }> => {
    const response: AxiosResponse = await apiClient.get("/2fa/reset")
    if (!response.data.success)
      throw new Error(response.data.message || "Reset 2FA thất bại")
    return response.data.data
  },

  // Setup 2FA
  setup2FA: async (data: {
    secret: string
    token: string
    password: string
    email_otp: string
  }): Promise<{
    success: boolean
    message: string
  }> => {
    const response: AxiosResponse = await apiClient.post("/2fa/setup", data)
    if (!response.data.success)
      throw new Error(response.data.message || "Setup 2FA thất bại")
    return response.data
  },

  // Disable 2FA
  disable2FA: async (data: {
    token: string
    password: string
    email_otp: string
  }): Promise<{
    success: boolean
    message: string
  }> => {
    const response: AxiosResponse = await apiClient.post("/2fa/disable", data)
    if (!response.data.success)
      throw new Error(response.data.message || "Disable 2FA thất bại")
    return response.data
  },

  // Verify 2FA token
  verify2FA: async (data: {
    token: string
  }): Promise<{
    success: boolean
    message: string
  }> => {
    const response: AxiosResponse = await apiClient.post("/2fa/verify", data)
    if (!response.data.success)
      throw new Error(response.data.message || "Verify 2FA thất bại")
    return response.data
  },

  // Lấy trạng thái 2FA
  getStatus: async (): Promise<{
    enabled: boolean
  }> => {
    const response: AxiosResponse = await apiClient.get("/2fa/status")
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy trạng thái 2FA thất bại")
    return response.data.data
  },

  // Gửi email verification code
  sendVerificationEmail: async (type: 'turn-on' | 'turn-off'): Promise<{
    success: boolean
    message: string
  }> => {
    const response: AxiosResponse = await apiClient.post("/2fa/send-verification-email", {
      type
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Gửi email verification thất bại")
    return response.data
  }
}
