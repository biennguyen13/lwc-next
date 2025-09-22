import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

const API_SERVER_URL = process.env.API_SERVER_URL + "/api/v1"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    // Validate required parameters
    if (!token || !email) {
      return NextResponse.redirect(
        new URL('/?error=missing_parameters', request.url)
      )
    }

    // Gọi Fastify API
    const response = await fetch(`${API_SERVER_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: decodeURIComponent(email),
        token: token
      }),
      cache: 'no-store' // Disable cache for this request
    })

    const data = await response.json()

    if (!response.ok) {
      // Verification failed - redirect to home with error message
      const errorResponse = NextResponse.redirect(
        new URL('/?verified=false&error=' + encodeURIComponent(data.message || 'Xác thực email thất bại'), request.url)
      )
      // Disable cache for error response
      errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      return errorResponse
    }

    // Verification successful - redirect to home with success message and email
    const successResponse = NextResponse.redirect(
      new URL('/?verified=true&message=' + encodeURIComponent(data.message || 'Email đã được xác thực thành công!') + '&email=' + encodeURIComponent(email) + '&openLogin=true', request.url)
    )
    // Disable cache for success response
    successResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return successResponse

  } catch (error) {
    console.error('Email verification error:', error)
    
    // Server error - redirect to home with error message
    const errorResponse = NextResponse.redirect(
      new URL('/?verified=false&error=' + encodeURIComponent('Lỗi server, vui lòng thử lại'), request.url)
    )
    // Disable cache for error response
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return errorResponse
  }
}
