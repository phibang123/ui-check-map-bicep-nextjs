// API Configuration
export const API_CONFIG = {
  // Lấy URL từ environment variable hoặc fallback về Azure App Service
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net',
  
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
    DOCUMENTS_DOWNLOAD: '/api/documents/:id/download',
    DOCUMENTS_STATS: '/api/documents/stats',
    
    // Todo Management
    TODOS: '/api/todos',
    TODOS_STATS: '/api/todos/stats',
    TODOS_TOGGLE: '/api/todos/:id/toggle',
    TODOS_BULK: '/api/todos/bulk',
    
    // Logic App Proxy
    LOGICAPP_PROXY: '/api/logicapp-proxy',
    LOGICAPP_PROXY_TABLES: '/api/logicapp-proxy/tables',
    LOGICAPP_PROXY_TEST: '/api/logicapp-proxy/test',
    LOGICAPP_PROXY_INFO: '/api/logicapp-proxy/info'
  }
} as const

// Helper function để tạo full URL
export const getApiUrl = (endpoint: string): string => {
  // Thêm cache-busting parameter để tránh cache
  const timestamp = Date.now()
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${API_CONFIG.BASE_URL}${endpoint}${separator}t=${timestamp}`
  console.log(`API call to: ${url}`)
  return url
}

// Helper function để test kết nối API
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
    return response.ok
  } catch (error) {
    console.error('API connection test failed:', error)
    return false
  }
}

// Helper function để tạo fetch options với cache headers
export const getFetchOptions = (method: string = 'GET', body?: any) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
    ...(body && { body: JSON.stringify(body) }),
  }
}
