import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const API_BASE_URL = process.env.API_BASE_URL

export async function POST(request: NextRequest) {
  try {
    // Lấy refresh token từ cookies
    const refreshToken = request.cookies.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token không tồn tại" },
        { status: 401 }
      )
    }

    // Gọi Fastify API
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Refresh token thất bại" },
        { status: response.status }
      )
    }

    // Tạo response với cookies mới
    const nextResponse = NextResponse.json({
      success: true,
      data: {
        user: data.data.user,
        message: "Refresh token thành công",
      },
    })

    // Tính thời gian còn lại cho access token
    const accessTokenMaxAge = data.data.expiresAt
      ? Math.floor(
          (new Date(data.data.expiresAt).getTime() - new Date().getTime()) /
            1000
        )
      : 15 * 60 // Fallback: 15 phút

    // Lưu access token mới vào httpOnly cookie
    nextResponse.cookies.set("access_token", data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessTokenMaxAge,
      path: "/",
    })

    // Lưu refresh token mới vào httpOnly cookie (nếu có)
    if (data.data.refreshToken) {
      // Tính thời gian còn lại cho refresh token
      const refreshTokenMaxAge = data.data.refreshTokenExpiresAt
        ? Math.floor(
            (new Date(data.data.refreshTokenExpiresAt).getTime() -
              new Date().getTime()) /
              1000
          )
        : 7 * 24 * 60 * 60 // Fallback: 7 ngày

      nextResponse.cookies.set("refresh_token", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: refreshTokenMaxAge,
        path: "/",
      })
    }

    return nextResponse
  } catch (error) {
    console.error("Refresh token API error:", error)
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    )
  }
}
