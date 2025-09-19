/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
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
    const backendUrl = process.env.API_SERVER_URL

    if (!backendUrl) {
      throw new Error("Missing API_SERVER_URL env variable")
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
    API_SERVER_URL: process.env.API_SERVER_URL,
    SOCKET_SERVER_URL: process.env.SERVER_SOCKET_URL,
    NEXT_SERVER_URL: process.env.NEXT_SERVER_URL,
  },
}

module.exports = nextConfig
