'use client'

import { motion } from 'framer-motion'
import { Globe, Settings, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { API_CONFIG } from '@/lib/config'

export default function ApiUrlDisplay() {
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(API_CONFIG.BASE_URL)
      setCopied(true)
      toast.success('Đã copy URL API!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Không thể copy URL')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card border-l-4 border-blue-500"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">API Base URL</h3>
            <p className="text-sm text-gray-600">URL backend hiện tại</p>
          </div>
        </div>
        <button
          onClick={handleCopyUrl}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600" />
          )}
          <span className="text-sm font-medium">
            {copied ? 'Đã copy' : 'Copy'}
          </span>
        </button>
      </div>

      <div className="p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <code className="text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded border">
            {API_CONFIG.BASE_URL}
          </code>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Lưu ý:</strong> URL này được lấy từ biến môi trường{' '}
          <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_API_URL</code>{' '}
          hoặc fallback về <code className="bg-blue-100 px-1 rounded">http://localhost:3000</code>
        </p>
      </div>
    </motion.div>
  )
}

