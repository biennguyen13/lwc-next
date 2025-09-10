import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if access token exists in cookies
    const accessToken = request.cookies.get('access_token')?.value
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccessToken: !!accessToken
      }
    })
  } catch (error) {
    console.error('Token check error:', error)
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    )
  }
}