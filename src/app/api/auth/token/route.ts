import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    return NextResponse.json({
      success: true,
      data: {
        accessToken: accessToken,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        // Không trả về token thực tế vì lý do bảo mật
        tokenInfo: accessToken
          ? {
              length: accessToken.length,
              type: "JWT",
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Get token info error:", error)
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    )
  }
}
