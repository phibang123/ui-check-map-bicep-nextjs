'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bug, CheckCircle, XCircle, Clock, Globe, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

import { API_CONFIG, getApiUrl, testApiConnection } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

interface DebugInfo {
  baseUrl: string
  environment: string
  debugMode: boolean
  timeout: number
  connectionStatus: 'checking' | 'success' | 'error' | 'timeout'
  lastError?: string
  responseTime?: number
}

export default function ApiDebugger() {
  const { t } = useLanguage()
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    baseUrl: API_CONFIG.BASE_URL,
    environment: process.env.NODE_ENV || 'development',
    debugMode: API_CONFIG.DEBUG,
    timeout: API_CONFIG.TIMEOUT,
    connectionStatus: 'checking',
  })
  const [isTesting, setIsTesting] = useState(false)

  const testConnection = async () => {
    setIsTesting(true)
    setDebugInfo(prev => ({ ...prev, connectionStatus: 'checking' }))
    
    const startTime = Date.now()
    
    try {
      const isConnected = await testApiConnection()
      const responseTime = Date.now() - startTime
      
      setDebugInfo(prev => ({
        ...prev,
        connectionStatus: isConnected ? 'success' : 'error',
        responseTime,
        lastError: isConnected ? undefined : 'Connection failed'
      }))
      
      if (isConnected) {
        toast.success(`✅ API connection successful (${responseTime}ms)`)
      } else {
        toast.error('❌ API connection failed')
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      setDebugInfo(prev => ({
        ...prev,
        connectionStatus: errorMessage.includes('timeout') ? 'timeout' : 'error',
        responseTime,
        lastError: errorMessage
      }))
      
      toast.error(`❌ API Error: ${errorMessage}`)
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusIcon = () => {
    switch (debugInfo.connectionStatus) {
      case 'checking':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'timeout':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      default:
        return <Bug className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (debugInfo.connectionStatus) {
      case 'checking':
        return 'border-yellow-200 bg-yellow-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'timeout':
        return 'border-orange-200 bg-orange-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`card border-l-4 ${getStatusColor()} hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Bug className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('debugger.title')}</h3>
            <p className="text-gray-600">{t('debugger.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <button
            onClick={testConnection}
            disabled={isTesting}
            className="btn-secondary disabled:opacity-50"
          >
            {isTesting ? 'Đang test...' : 'Test lại'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="p-4 bg-white rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>{t('debugger.connectionStatus')}</span>
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('debugger.status')}:</span>
              <span className={`text-sm font-medium ${
                debugInfo.connectionStatus === 'success' ? 'text-green-600' :
                debugInfo.connectionStatus === 'error' ? 'text-red-600' :
                debugInfo.connectionStatus === 'timeout' ? 'text-orange-600' :
                'text-yellow-600'
              }`}>
                {debugInfo.connectionStatus === 'checking' ? t('debugger.checking') :
                 debugInfo.connectionStatus === 'success' ? t('debugger.connectionSuccess') :
                 debugInfo.connectionStatus === 'error' ? t('debugger.connectionError') :
                 debugInfo.connectionStatus === 'timeout' ? t('debugger.timeout') : t('debugger.unknown')}
              </span>
            </div>
            {debugInfo.responseTime && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('debugger.responseTime')}:</span>
                <span className="text-sm font-medium text-gray-900">{debugInfo.responseTime}ms</span>
              </div>
            )}
            {debugInfo.lastError && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('debugger.error')}:</span>
                <span className="text-sm font-medium text-red-600">{debugInfo.lastError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Info */}
        <div className="p-4 bg-white rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">{t('debugger.configuration')}</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('debugger.baseUrl')}:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                {debugInfo.baseUrl}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('debugger.environment')}:</span>
              <span className="text-sm font-medium text-gray-900">{debugInfo.environment}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('debugger.debugMode')}:</span>
              <span className={`text-sm font-medium ${debugInfo.debugMode ? 'text-green-600' : 'text-gray-600'}`}>
                {debugInfo.debugMode ? t('debugger.enabled') : t('debugger.disabled')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('debugger.timeout')}:</span>
              <span className="text-sm font-medium text-gray-900">{debugInfo.timeout}ms</span>
            </div>
          </div>
        </div>

        {/* Test URLs */}
        <div className="p-4 bg-white rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">{t('debugger.testUrls')}</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">{t('debugger.healthCheck')}:</span>
              <code className="block text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 mt-1">
                {getApiUrl('/health')}
              </code>
            </div>
            <div>
              <span className="text-sm text-gray-600">{t('debugger.documentsApi')}:</span>
              <code className="block text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 mt-1">
                {getApiUrl('/api/documents')}
              </code>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
