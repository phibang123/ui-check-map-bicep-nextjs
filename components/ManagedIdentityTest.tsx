'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertCircle, Clock, Database, Key } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { getApiUrl, API_CONFIG } from '@/lib/config'

interface ManagedIdentityResult {
  success: boolean
  message: string
  authenticationMethod: string
  responseTime: string
  containerCount: number
  containers: string[]
  error?: string
}

export default function ManagedIdentityTest() {
  const [result, setResult] = useState<ManagedIdentityResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testManagedIdentity = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(getApiUrl('/api/storage/test-mi'))
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        toast.success('Kết nối Azure Storage với Managed Identity thành công!')
      } else {
        toast.error(`Lỗi kết nối: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể kết nối đến server')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card border-l-4 border-purple-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Managed Identity Test</h3>
            <p className="text-gray-600">Test kết nối Azure Storage với Managed Identity</p>
          </div>
        </div>
        <button
          onClick={testManagedIdentity}
          disabled={isLoading}
          className="btn-primary disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang test...</span>
            </div>
          ) : (
            'Test Managed Identity'
          )}
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Status */}
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <div>
              <h4 className={`font-semibold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Kết nối thành công' : 'Kết nối thất bại'}
              </h4>
              <p className={`text-sm ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
            </div>
          </div>

          {/* Connection Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Key className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600">Authentication</p>
              </div>
              <p className="font-semibold text-gray-900">{result.authenticationMethod}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600">Response Time</p>
              </div>
              <p className="font-semibold text-gray-900">{result.responseTime}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600">Containers</p>
              </div>
              <p className="font-semibold text-gray-900">{result.containerCount}</p>
            </div>
          </div>

          {/* Containers List */}
          {result.containers && result.containers.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Available Containers ({result.containers.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {result.containers.map((container, index) => (
                  <motion.div
                    key={container}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-2 p-2 bg-white rounded border"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-mono text-sm text-gray-700">{container}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Error Details */}
          {!result.success && result.error && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Chi tiết lỗi</h4>
              <p className="text-red-700 text-sm">{result.error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Về Managed Identity</h4>
            <p className="text-blue-800 text-sm">
              Managed Identity là phương thức xác thực an toàn nhất cho Azure services. 
              Không cần lưu trữ keys hoặc secrets, Azure tự động quản lý credentials.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

