import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const API_SERVER_URL = process.env.API_SERVER_URL

export async function POST(request: NextRequest) {
  try {
    // Lấy access token từ cookies để gửi đến backend
    const accessToken = request.cookies.get('access_token')?.value
    
    if (!accessToken) {
      // Nếu không có token, chỉ xóa cookies local
      const response = NextResponse.json({
        success: true,
        message: 'Đăng xuất thành công'
      })
      
      // Xóa cookies
      response.cookies.set('access_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Xóa ngay lập tức
        path: '/',
      })
      
      response.cookies.set('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Xóa ngay lập tức
        path: '/',
      })
      
      return response
    }

    // Gọi Fastify API để logout
    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    // Tạo response với cookies đã xóa
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    })

    // Xóa cookies
    nextResponse.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Xóa ngay lập tức
      path: '/',
    })

    nextResponse.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Xóa ngay lập tức
      path: '/',
    })

    return nextResponse
  } catch (error) {
    console.error('Logout API error:', error)
    
    // Ngay cả khi có lỗi, vẫn xóa cookies local
    const response = NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    })
    
    // Xóa cookies
    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    return response
  }
} 