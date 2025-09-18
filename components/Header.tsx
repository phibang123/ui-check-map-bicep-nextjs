'use client'

import { motion } from 'framer-motion'
import { Server, Activity } from 'lucide-react'
import LanguageSelector from './LanguageSelector'

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-azure-600 rounded-lg">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">KIN241</h1>
              <p className="text-sm text-gray-600">API Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live</span>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

