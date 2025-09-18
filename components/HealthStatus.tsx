'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface HealthStatusProps {
  healthData: any
}

export default function HealthStatus({ healthData }: HealthStatusProps) {
  const { t } = useLanguage()
  const isHealthy = healthData?.status === 'OK'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('health.title')}</h2>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
          isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isHealthy ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-semibold">
            {isHealthy ? 'Khỏe mạnh' : 'Có lỗi'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Environment</p>
              <p className="font-semibold text-gray-900">
                {healthData?.environment || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900">
                {healthData?.status || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Port</p>
              <p className="font-semibold text-gray-900">
                {healthData?.port || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Check</p>
              <p className="font-semibold text-gray-900 text-xs">
                {healthData?.timestamp ? 
                  new Date(healthData.timestamp).toLocaleString('vi-VN') : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {healthData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Chi tiết phản hồi</h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {JSON.stringify(healthData, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  )
}

