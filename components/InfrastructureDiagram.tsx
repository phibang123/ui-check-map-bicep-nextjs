'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Cloud, Server, Database, Shield, Globe, Maximize2, Minimize2, Zap, HardDrive, MessageSquare, Table, Route, Lock, Network, Layers } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const InfrastructureDiagram: React.FC = () => {
  const { t, locale } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [imageKey, setImageKey] = useState(0)
  const [useFallback, setUseFallback] = useState(false)
  
  // Force re-render when locale changes
  useEffect(() => {
    setImageKey(prev => prev + 1)
    console.log('🔄 Language changed to:', locale)
  }, [locale])
  
  // Select image based on language
  const getImageSrc = () => {
    const src = locale === 'ja' 
      ? '/images/diagrams/kin241-release-v3-jp.png'
      : '/images/diagrams/kin241-release-v3.png'
    
    // Debug log
    console.log('🌐 Current locale:', locale)
    console.log('🖼️ Image source:', src)
    
    return src
  }
  
  // Get image quality based on language
  const getImageQuality = () => {
    return locale === 'ja' ? 100 : 95
  }
  
  // Get image dimensions based on language
  const getImageDimensions = () => {
    return locale === 'ja' 
      ? { width: 2000, height: 1500 }  // Higher resolution for Japanese image
      : { width: 1600, height: 1200 }
  }

  // Infrastructure components data
  const infraComponents = [
    {
      name: t('infrastructure.frontDoor') || 'Azure Front Door',
      type: 'CDN',
      icon: Globe,
      color: 'text-blue-600',
      description: 'Global load balancer and CDN'
    },
    {
      name: t('infrastructure.appGateway') || 'Application Gateway',
      type: 'Gateway',
      icon: Shield,
      color: 'text-green-600',
      description: 'Web application firewall and load balancer'
    },
    {
      name: t('infrastructure.appService') || 'App Service',
      type: 'Compute',
      icon: Server,
      color: 'text-purple-600',
      description: 'Managed hosting platform'
    },
    {
      name: t('infrastructure.logicApp') || 'Logic App',
      type: 'Integration',
      icon: Zap,
      color: 'text-yellow-600',
      description: t('infrastructure.logicAppDesc') || 'Serverless workflow automation'
    },
    {
      name: t('infrastructure.database') || 'MySQL Database',
      type: 'Database',
      icon: Database,
      color: 'text-orange-600',
      description: 'Managed MySQL database'
    },
    {
      name: t('infrastructure.fileStorage') || 'File Storage',
      type: 'Storage',
      icon: HardDrive,
      color: 'text-indigo-600',
      description: t('infrastructure.fileStorageDesc') || 'File share storage'
    },
    {
      name: t('infrastructure.queueStorage') || 'Queue Storage',
      type: 'Storage',
      icon: MessageSquare,
      color: 'text-pink-600',
      description: t('infrastructure.queueStorageDesc') || 'Message queue storage'
    },
    {
      name: t('infrastructure.blobStorage') || 'Blob Storage',
      type: 'Storage',
      icon: Cloud,
      color: 'text-cyan-600',
      description: t('infrastructure.blobStorageDesc') || 'Object blob storage'
    },
    {
      name: t('infrastructure.tableStorage') || 'Table Storage',
      type: 'Storage',
      icon: Table,
      color: 'text-emerald-600',
      description: t('infrastructure.tableStorageDesc') || 'NoSQL table storage'
    },
    {
      name: t('infrastructure.virtualNetwork') || 'Virtual Network',
      type: 'Network',
      icon: Network,
      color: 'text-blue-600',
      description: t('infrastructure.virtualNetworkDesc') || 'Isolated network environment'
    },
    {
      name: t('infrastructure.subnet') || 'Subnet',
      type: 'Network',
      icon: Layers,
      color: 'text-green-600',
      description: t('infrastructure.subnetDesc') || 'Network segmentation'
    },
    {
      name: t('infrastructure.nsg') || 'NSG',
      type: 'Security',
      icon: Shield,
      color: 'text-indigo-600',
      description: t('infrastructure.nsgDesc') || 'Network Security Group'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <span>{t('infrastructure.title') || 'KIN241 Cloud Infrastructure'}</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('infrastructure.subtitle') || 'Azure-based architecture with high availability and scalability'}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {isExpanded ? (
                <Minimize2 className="w-5 h-5 text-gray-600" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Infrastructure Diagram - Real Architecture Image */}
          <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">{t('infrastructure.internetTraffic') || 'KIN241 Azure Architecture'}</span>
              </div>
            </div>

            {/* Real Architecture Diagram */}
            <div className="relative w-full h-auto bg-white rounded-lg border shadow-lg overflow-hidden">
              <div className="relative group">
                {useFallback ? (
                  <img
                    key={`diagram-fallback-${locale}-${imageKey}`}
                    src={`${getImageSrc()}?v=${imageKey}&t=${Date.now()}`}
                    alt="KIN241 Azure Infrastructure Architecture"
                    className={`w-full h-auto object-contain transition-all duration-300 cursor-pointer ${
                      isImageZoomed ? 'scale-110' : 'hover:scale-105'
                    }`}
                    style={{
                      imageRendering: 'crisp-edges',
                      filter: locale === 'ja' ? 'contrast(1.1) saturate(1.1) brightness(1.05)' : 'none'
                    }}
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                    onError={() => {
                      console.log('❌ Image load error, trying fallback')
                      setUseFallback(true)
                    }}
                  />
                ) : (
                  <Image
                    key={`diagram-${locale}-${imageKey}-${Date.now()}`}
                    src={`${getImageSrc()}?v=${imageKey}&t=${Date.now()}`}
                    alt="KIN241 Azure Infrastructure Architecture"
                    width={getImageDimensions().width}
                    height={getImageDimensions().height}
                    className={`w-full h-auto object-contain transition-all duration-300 cursor-pointer ${
                      isImageZoomed ? 'scale-110' : 'hover:scale-105'
                    }`}
                    style={{
                      imageRendering: 'crisp-edges',
                      filter: locale === 'ja' ? 'contrast(1.1) saturate(1.1) brightness(1.05)' : 'none'
                    }}
                    priority
                    quality={getImageQuality()}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                    onError={() => {
                      console.log('❌ Next.js Image error, switching to fallback')
                      setUseFallback(true)
                    }}
                    unoptimized={process.env.NODE_ENV === 'production'}
                  />
                )}
                
                {/* Zoom Button */}
                <button
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  {isImageZoomed ? (
                    <Minimize2 className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="mt-6 p-4 bg-white rounded-lg border shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <span>{t('infrastructure.architectureHighlights') || 'Architecture Highlights'}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>• {t('infrastructure.highAvailability') || 'High availability across multiple regions'}</li>
                  <li>• {t('infrastructure.autoScaling') || 'Auto-scaling based on demand'}</li>
                  <li>• {t('infrastructure.builtInSecurity') || 'Built-in security and compliance'}</li>
                  <li>• {t('infrastructure.logicAppAutomation') || 'Logic App workflow automation'}</li>
                  <li>• {t('infrastructure.privateEndpoints') || '6 Private Endpoints for secure access'}</li>
                </ul>
                <ul className="space-y-1">
                  <li>• {t('infrastructure.monitoring') || 'Integrated monitoring and logging'}</li>
                  <li>• {t('infrastructure.cicd') || 'CI/CD pipeline with Azure DevOps'}</li>
                  <li>• {t('infrastructure.disasterRecovery') || 'Disaster recovery capabilities'}</li>
                  <li>• {t('infrastructure.networkProtection') || 'Route table with firewall protection'}</li>
                  <li>• {t('infrastructure.multipleStorage') || 'Multiple storage types (File, Queue, Blob, Table)'}</li>
                  <li>• {t('infrastructure.virtualNetwork') || 'Virtual Network with Subnet segmentation'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Infrastructure Components List */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {infraComponents.map((component, index) => (
                <motion.div
                  key={component.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <component.icon className={`w-6 h-6 ${component.color}`} />
                    <div>
                      <div className="font-medium text-gray-900">{component.name}</div>
                      <div className="text-sm text-gray-600">{component.type}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{component.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  )
}

export default InfrastructureDiagram
