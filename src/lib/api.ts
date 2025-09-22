import axios, { AxiosResponse } from "axios"
import { LoginCredentials, AuthResponse, User } from "@/types"

// Tạo axios instance với interceptors
const apiClient = axios.create({
  baseURL: "/api/v1", // Gọi qua Next.js rewrites
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Gửi cookies tự động
})

// Request interceptor - không cần thêm token vì dùng withCredentials
apiClient.interceptors.request.use(
  (config) => {
    // withCredentials: true sẽ tự động gửi cookies
    // Backend sẽ nhận token từ cookies hoặc Authorization header
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor để xử lý refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Gọi refresh token API route
        const refreshResponse = await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        )

        if (refreshResponse.data.success) {
          // Token đã được refresh và lưu vào cookies
          // Thử lại request ban đầu
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token cũng hết hạn
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ==================== AUTH API ====================
export const authAPI = {
  // Đăng nhập - vẫn dùng API route để xử lý cookies
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse = await axios.post(
      "/api/auth/login",
      credentials
    )
    if (!response.data.success)
      throw new Error(response.data.message || "Đăng nhập thất bại")
    return response.data.data
  },

  // Đăng xuất - gọi qua API route
  logout: async (): Promise<void> => {
    await axios.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    )
  },

  // Đăng ký - gọi trực tiếp đến Fastify backend
  register: async (userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    nickname: string
    phone: string
  }): Promise<{ 
    success: boolean
    message: string
    data: {
      account: {
        id: number
        email: string
        first_name: string
        last_name: string
        nickname: string
        type: string
        status: string
        created_at: string
      }
    }
  }> => {
    const response: AxiosResponse = await apiClient.post(
      "/auth/register",
      userData
    )
    return response.data
  },

  // Refresh token - gọi qua API route
  refreshToken: async (): Promise<AuthResponse> => {
    const response: AxiosResponse = await axios.post(
      "/api/auth/refresh",
      {},
      {
        withCredentials: true,
      }
    )
    if (!response.data.success)
      throw new Error(response.data.message || "Refresh token thất bại")
    return response.data.data
  },

  hasAccessToken: async (): Promise<boolean> => {
    const response: AxiosResponse = await axios.get("/api/auth/token")
    return response.data.data.hasAccessToken
  },

  // Verify email - gọi trực tiếp đến Fastify backend
  verifyEmail: async (email: string, token: string): Promise<{ 
    success: boolean
    message: string
    data?: any
  }> => {
    const response: AxiosResponse = await apiClient.post(
      "/auth/verify-email",
      { email, token }
    )
    return response.data
  },
}

// ==================== ACCOUNT API ====================
export const accountAPI = {
  // Lấy profile cá nhân - gọi trực tiếp backend
  getProfile: async (): Promise<User> => {
    const response: AxiosResponse = await apiClient.get("/profile")
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy profile thất bại")
    return response.data.data
  },
}

export default apiClient
