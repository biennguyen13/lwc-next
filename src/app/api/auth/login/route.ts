import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL + "/api/v1"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Gọi Fastify API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Đăng nhập thất bại" },
        { status: response.status }
      )
    }

    // Tạo response với cookies
    const nextResponse = NextResponse.json({
      success: true,
      data: {
        user: data.data.user,
        message: "Đăng nhập thành công",
      },
    })

    const accessTokenMaxAge = Math.floor(
      (new Date(data.data.expiresAt).getTime() - new Date().getTime()) / 1000
    )

    // Lưu access token vào httpOnly cookie
    nextResponse.cookies.set("access_token", data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessTokenMaxAge, // Thời gian còn lại của access token
      path: "/",
    })

    const refreshTokenMaxAge = Math.floor(
      (new Date(data.data.refreshTokenExpiresAt).getTime() -
        new Date().getTime()) /
        1000
    )

    // Lưu refresh token vào httpOnly cookie
    nextResponse.cookies.set("refresh_token", data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenMaxAge, // Thời gian còn lại của refresh token
      path: "/",
    })

    return nextResponse
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    )
  }
}
