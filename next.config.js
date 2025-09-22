/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net',
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE || 'false',
  },
  
  // Disable caching for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      // CORS headers for external API calls
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // Rewrites for API proxy (optional)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net'
    
    // Only add rewrites if we have a valid API URL
    if (apiUrl && (apiUrl.startsWith('http://') || apiUrl.startsWith('https://'))) {
      return [
        {
          source: '/api/proxy/:path*',
          destination: `${apiUrl}/:path*`,
        },
      ];
    }
    
    return [];
  },
}

module.exports = nextConfig

