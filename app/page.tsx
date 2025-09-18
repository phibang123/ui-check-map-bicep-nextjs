'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { 
  Server, 
  Database, 
  Activity, 
  Cloud, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Zap,
  Globe,
  Shield,
  Link
} from 'lucide-react'

import Header from '@/components/Header'
import EndpointCard from '@/components/EndpointCard'
import HealthStatus from '@/components/HealthStatus'
import DocumentManagement from '@/components/DocumentManagement'
import PingConnectivity from '@/components/PingConnectivity'
import LoadingSpinner from '@/components/LoadingSpinner'
import ApiUrlDisplay from '@/components/ApiUrlDisplay'

import { getApiUrl, API_CONFIG } from '@/lib/config'

interface ApiResponse {
  success: boolean
  message?: string
  timestamp?: string
  status?: string
  uptime?: number
  memory?: any
  platform?: string
  nodeVersion?: string
  error?: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<ApiResponse | null>(null)
  const [healthStatus, setHealthStatus] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch health status
        const healthResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH))
        const healthData = await healthResponse.json()
        setHealthStatus(healthData)
        
        // Set basic API status since /api/status endpoint doesn't exist in new backend
        setApiStatus({
          status: 'running',
          uptime: 0,
          memory: { used: 0, total: 0 },
          platform: 'unknown',
          nodeVersion: 'unknown'
        })
        
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const endpoints = [
    {
      title: 'Health Check',
      description: 'Kiểm tra trạng thái sức khỏe của server',
      endpoint: '/health',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Detailed Health',
      description: 'Kiểm tra chi tiết sức khỏe hệ thống',
      endpoint: '/health/detailed',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Documents API',
      description: 'Quản lý documents với Logic App integration',
      endpoint: '/api/documents',
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Ping Service',
      description: 'Test kết nối mạng và các dịch vụ',
      endpoint: '/api/ping',
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Logic App Status',
      description: 'Kiểm tra trạng thái Logic App integration',
      endpoint: '/api/documents/logic-app/status',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Document Statistics',
      description: 'Thống kê documents và xử lý',
      endpoint: '/api/documents/stats',
      icon: Link,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }
  ]

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-azure-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">
            KIN241 Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Giao diện quản lý và giám sát cho KIN241 Node.js API với Logic App integration
          </p>
        </motion.div>

        {/* API URL Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <ApiUrlDisplay />
        </motion.div>

        {/* Status Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Server Status</h3>
                <p className="text-sm text-gray-600">
                  {healthStatus?.status === 'OK' ? 'Đang hoạt động' : 'Không kết nối được'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Uptime</h3>
                <p className="text-sm text-gray-600">
                  {apiStatus?.uptime ? `${Math.floor(apiStatus.uptime / 3600)}h ${Math.floor((apiStatus.uptime % 3600) / 60)}m` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Node Version</h3>
                <p className="text-sm text-gray-600">
                  {apiStatus?.nodeVersion || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Health Status Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <HealthStatus healthData={healthStatus} />
        </motion.div>

        {/* Document Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <DocumentManagement />
        </motion.div>

        {/* Ping & Connectivity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <PingConnectivity />
        </motion.div>

        {/* Endpoints Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            API Endpoints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.endpoint}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <EndpointCard {...endpoint} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
