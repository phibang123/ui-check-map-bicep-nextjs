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
import HealthStatus from '@/components/HealthStatus'
import DocumentManagement from '@/components/DocumentManagement'
import TodoManagement from '@/components/TodoManagement'
import PingConnectivity from '@/components/PingConnectivity'
import FileUpload from '@/components/FileUpload'
import LoadingSpinner from '@/components/LoadingSpinner'
import ApiUrlDisplay from '@/components/ApiUrlDisplay'
import InfrastructureDiagram from '@/components/InfrastructureDiagram'
import LogicAppTrigger from '@/components/LogicAppTrigger'
import ApiDebugger from '@/components/ApiDebugger'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRef } from 'react'

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
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<ApiResponse | null>(null)
  const documentManagementRef = useRef<any>(null)
  const [healthStatus, setHealthStatus] = useState<ApiResponse | null>(null)

  const handleUploadSuccess = () => {
    // Reload DocumentManagement when upload is successful
    if (documentManagementRef.current?.fetchDocuments) {
      documentManagementRef.current.fetchDocuments()
    }
  }

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
          success: true,
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
      title: t('endpoints.healthCheck'),
      description: t('health.description'),
      endpoint: '/health',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: t('endpoints.detailedHealth'),
      description: t('health.detailed'),
      endpoint: '/health/detailed',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: t('endpoints.documentsApi'),
      description: t('documents.subtitle'),
      endpoint: '/api/documents',
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: t('endpoints.todosApi'),
      description: t('todos.subtitle'),
      endpoint: '/api/todos',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: t('endpoints.pingService'),
      description: t('ping.subtitle'),
      endpoint: '/api/ping',
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: t('endpoints.documentStats'),
      description: t('documents.stats'),
      endpoint: '/api/documents/stats',
      icon: Link,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      title: t('endpoints.todoStats'),
      description: t('todos.stats'),
      endpoint: '/api/todos/stats',
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
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
            {t('dashboard.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('dashboard.subtitle')}
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

        {/* Infrastructure Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-8"
        >
          <InfrastructureDiagram />
        </motion.div>

        {/* Status Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('dashboard.serverStatus')}</h3>
                <p className="text-sm text-gray-600">
                  {healthStatus?.status === 'OK' ? t('dashboard.running') : t('dashboard.notConnected')}
                </p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('dashboard.uptime')}</h3>
                <p className="text-sm text-gray-600">
                  {apiStatus?.uptime ? `${Math.floor(apiStatus.uptime / 3600)}h ${Math.floor((apiStatus.uptime % 3600) / 60)}m` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('dashboard.nodeVersion')}</h3>
                <p className="text-sm text-gray-600">
                  {apiStatus?.nodeVersion || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Debugger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <ApiDebugger />
        </motion.div>

        {/* Health Status Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-12"
        >
          <HealthStatus healthData={healthStatus} />
        </motion.div>

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mb-12"
        >
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </motion.div>

        {/* Document Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mb-12"
        >
          <DocumentManagement ref={documentManagementRef} />
        </motion.div>

        {/* Todo Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mb-12"
        >
          <TodoManagement />
        </motion.div>

        {/* Logic App Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <LogicAppTrigger />
        </motion.div>

        {/* Ping & Connectivity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mb-12"
        >
          <PingConnectivity />
        </motion.div>

      </main>
    </div>
  )
}
