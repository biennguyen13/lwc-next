/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!backendUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_BASE_URL env variable")
    }
    console.log('backendUrl', backendUrl)
    return [
      // Proxy tất cả API calls đến backend
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ]
  },
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_BASE_URL,
  },
}

module.exports = nextConfig
