'use client'

import { motion } from 'framer-motion'
import { 
  Wifi, 
  Globe, 
  Server, 
  Github, 
  Building2, 
  Network, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import { getApiUrl, API_CONFIG } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

interface PingResult {
  name: string
  url: string
  status: 'online' | 'offline' | 'testing'
  responseTime?: number
  error?: string
}

interface ConnectivityData {
  success: boolean
  data: {
    summary: {
      total: number
      online: number
      offline: number
      averageResponseTime: number
    }
    results: PingResult[]
  }
  error?: string
}

export default function PingConnectivity() {
  const { t } = useLanguage()
  const [connectivityData, setConnectivityData] = useState<ConnectivityData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [individualTests, setIndividualTests] = useState<Record<string, boolean>>({})

  const pingEndpoints = [
    {
      name: 'Ping Service',
      endpoint: API_CONFIG.ENDPOINTS.PING,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'All Connectivity',
      endpoint: API_CONFIG.ENDPOINTS.PING_ALL,
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Microsoft',
      endpoint: API_CONFIG.ENDPOINTS.PING_MICROSOFT,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'GitHub',
      endpoint: API_CONFIG.ENDPOINTS.PING_GITHUB,
      icon: Github,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      name: 'Internet',
      endpoint: API_CONFIG.ENDPOINTS.PING_INTERNET,
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'DNS Resolution',
      endpoint: API_CONFIG.ENDPOINTS.PING_DNS,
      icon: Network,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      name: 'Comprehensive Test',
      endpoint: API_CONFIG.ENDPOINTS.PING_CONNECTIVITY,
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ]

  const testAllConnectivity = async () => {
    setIsTestingAll(true)
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PING_ALL))
      const data: ConnectivityData = await response.json()
      
      if (data.success) {
        setConnectivityData(data)
        toast.success(`Tested ${data.data.results.length} endpoints`)
      } else {
        toast.error(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể test connectivity')
    } finally {
      setIsTestingAll(false)
    }
  }

  const testIndividualEndpoint = async (endpoint: string, name: string) => {
    setIndividualTests(prev => ({ ...prev, [endpoint]: true }))
    try {
      const response = await fetch(getApiUrl(endpoint))
      const data = await response.json()
      
      if (data.success) {
        toast.success(`${name} test thành công`)
      } else {
        toast.error(`${name} test thất bại: ${data.error}`)
      }
    } catch (error) {
      toast.error(`${name} test thất bại`)
    } finally {
      setIndividualTests(prev => ({ ...prev, [endpoint]: false }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'offline': return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'testing': return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100'
      case 'offline': return 'text-red-600 bg-red-100'
      case 'testing': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatResponseTime = (time?: number): string => {
    if (!time) return 'N/A'
    return `${time}ms`
  }

  useEffect(() => {
    testAllConnectivity()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wifi className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('ping.title')}</h3>
              <p className="text-gray-600">{t('ping.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={testAllConnectivity}
            disabled={isTestingAll}
            className="btn-primary disabled:opacity-50"
          >
            {isTestingAll ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang test...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4" />
                <span>Test All</span>
              </div>
            )}
          </button>
        </div>

        {/* Connectivity Summary */}
        {connectivityData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h4 className="font-semibold text-gray-900 mb-4">Connectivity Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {connectivityData.data.summary.total}
                </div>
                <div className="text-sm text-blue-800">Total Tests</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {connectivityData.data.summary.online}
                </div>
                <div className="text-sm text-green-800">Online</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {connectivityData.data.summary.offline}
                </div>
                <div className="text-sm text-red-800">Offline</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {connectivityData.data.summary.averageResponseTime}ms
                </div>
                <div className="text-sm text-purple-800">Avg Response</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Individual Test Results */}
        {connectivityData && connectivityData.data.results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h4 className="font-semibold text-gray-900 mb-4">Test Results</h4>
            <div className="space-y-3">
              {connectivityData.data.results.map((result, index) => (
                <motion.div
                  key={result.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h5 className="font-semibold text-gray-900">{result.name}</h5>
                        <p className="text-sm text-gray-600">{result.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status}
                        </div>
                        {result.responseTime && (
                          <div className="text-sm text-gray-600 mt-1">
                            {formatResponseTime(result.responseTime)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {result.error}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Individual Test Buttons */}
      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-4">Individual Tests</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pingEndpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.endpoint}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 ${endpoint.bgColor} rounded-lg`}>
                  <endpoint.icon className={`w-5 h-5 ${endpoint.color}`} />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">{endpoint.name}</h5>
                  <p className="text-sm text-gray-600">Test connectivity</p>
                </div>
              </div>
              
              <button
                onClick={() => testIndividualEndpoint(endpoint.endpoint, endpoint.name)}
                disabled={individualTests[endpoint.endpoint]}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {individualTests[endpoint.endpoint] ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4" />
                    <span>Test Now</span>
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
