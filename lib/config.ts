// API Configuration
export const API_CONFIG = {
  // Lấy URL từ environment variable hoặc fallback về Azure App Service
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://app-officialhrpoke-kinyu-japaneast-002.azurewebsites.net',
  
  // Các endpoint paths theo backend API mới
  ENDPOINTS: {
    // Health & Status
    HEALTH: '/health',
    HEALTH_DETAILED: '/health/detailed',
    HEALTH_READINESS: '/health/readiness',
    HEALTH_LIVENESS: '/health/liveness',
    HEALTH_CONNECTIVITY: '/health/connectivity',
    HEALTH_NETWORK: '/health/network',
    
    // System Information
    API_INFO: '/api',
    AUTH_TEST: '/api/auth/test',
    AUTH_STATUS: '/api/auth/status',
    AUTH_ME: '/api/auth/me',
    
    // Ping & Connectivity
    PING: '/api/ping',
    PING_ALL: '/api/ping/all',
    PING_MICROSOFT: '/api/ping/microsoft',
    PING_GITHUB: '/api/ping/github',
    PING_INTERNET: '/api/ping/internet',
    PING_DNS: '/api/ping/dns',
    PING_CONNECTIVITY: '/api/ping/connectivity',
    
    // Document Management
    DOCUMENTS: '/api/documents',
    DOCUMENTS_UPLOAD: '/api/documents/upload',
    DOCUMENTS_UPLOAD_MULTIPLE: '/api/documents/upload/multiple',
    DOCUMENTS_STATS: '/api/documents/stats',
    DOCUMENTS_PROCESS: '/api/documents/:id/process',
    DOCUMENTS_BULK_PROCESS: '/api/documents/bulk/process',
    
    // Logic App Integration
    LOGIC_APP_STATUS: '/api/documents/logic-app/status',
    LOGIC_APP_TEST: '/api/documents/logic-app/test'
  }
} as const

// Helper function để tạo full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function để test kết nối API
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.ok
  } catch (error) {
    console.error('API connection test failed:', error)
    return false
  }
}
