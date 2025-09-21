'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useLanguage } from '../contexts/LanguageContext'
import { getApiUrl } from '../lib/config'
import LoadingSpinner from './LoadingSpinner'
import { RefreshCcw, Play, Database } from 'lucide-react'

interface LogicAppResponse {
  success: boolean
  message?: string
  tables?: any[]
  responseTime?: string
  timestamp?: string
  error?: string
  details?: string
}

const LogicAppTrigger: React.FC = () => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [lastResponse, setLastResponse] = useState<LogicAppResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getTables = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(getApiUrl('/api/logicapp-proxy/tables'))
      const result: LogicAppResponse = await response.json()
      setLastResponse(result)
      
      if (result.success) {
        toast.success('Tables retrieved successfully!')
      } else {
        toast.error(result.error || 'Failed to get tables')
        setError(result.error || 'Failed to get tables')
      }
    } catch (err: any) {
      const errorMsg = err.message
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(getApiUrl('/api/logicapp-proxy/test'))
      const result: LogicAppResponse = await response.json()
      
      if (result.success) {
        toast.success(`Connection OK (${result.responseTime})`)
      } else {
        toast.error(result.error || 'Connection failed')
        setError(result.error || 'Connection failed')
      }
    } catch (err: any) {
      const errorMsg = err.message
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg border border-gray-200 p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('logicApp.title')}</h2>
            <p className="text-gray-600 mt-1">{t('logicApp.subtitle')}</p>
          </div>
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCcw className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={getTables}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center text-lg"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Database className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Getting Tables...' : 'Get Tables from Logic App'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="text-red-800 font-medium">Error</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        )}

        {/* Response Display */}
        {lastResponse && lastResponse.success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-medium mb-3 text-gray-800">Tables from Logic App</h4>
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="text-green-800 font-medium mb-2">✅ {lastResponse.message}</div>
              {lastResponse.tables && (
                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-2">Tables ({lastResponse.tables.length}):</div>
                  <pre className="bg-white border p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(lastResponse.tables, null, 2)}
                  </pre>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {lastResponse.timestamp && new Date(lastResponse.timestamp).toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default LogicAppTrigger