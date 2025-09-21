'use client'

import { motion } from 'framer-motion'
import { LucideIcon, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { getApiUrl } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

interface EndpointCardProps {
  title: string
  description: string
  endpoint: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
}

export default function EndpointCard({
  title,
  description,
  endpoint,
  icon: Icon,
  color,
  bgColor,
  borderColor
}: EndpointCardProps) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)

  const handleTestEndpoint = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(getApiUrl(endpoint))
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`${title} ${t('common.success')}!`)
      } else {
        toast.error(`${t('common.error')}: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className={`card border-l-4 ${borderColor} hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {description}
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="text-sm font-mono text-gray-700">
            {endpoint}
          </span>
        </div>
        
        <button
          onClick={handleTestEndpoint}
          disabled={isLoading}
          className="w-full btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t('common.loading')}</span>
            </div>
          ) : (
            t('common.test')
          )}
        </button>
      </div>
    </motion.div>
  )
}
