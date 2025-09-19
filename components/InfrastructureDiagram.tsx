'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Server, Database, Shield, Globe, Maximize2, Minimize2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const InfrastructureDiagram: React.FC = () => {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  // Infrastructure components data
  const infraComponents = [
    {
      name: t('dashboard.infrastructure.frontDoor') || 'Azure Front Door',
      type: 'CDN',
      icon: Globe,
      color: 'text-blue-600',
      description: 'Global load balancer and CDN'
    },
    {
      name: t('dashboard.infrastructure.appGateway') || 'Application Gateway',
      type: 'Gateway',
      icon: Shield,
      color: 'text-green-600',
      description: 'Web application firewall and load balancer'
    },
    {
      name: t('dashboard.infrastructure.appService') || 'App Service',
      type: 'Compute',
      icon: Server,
      color: 'text-purple-600',
      description: 'Managed hosting platform'
    },
    {
      name: t('dashboard.infrastructure.database') || 'MySQL Database',
      type: 'Database',
      icon: Database,
      color: 'text-orange-600',
      description: 'Managed MySQL database'
    },
    {
      name: t('dashboard.infrastructure.storage') || 'Storage Account',
      type: 'Storage',
      icon: Cloud,
      color: 'text-indigo-600',
      description: 'Blob and file storage'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <span>KIN241 Cloud Infrastructure</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Azure-based architecture with high availability and scalability
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
          {/* Infrastructure Diagram - Placeholder for now */}
          <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Internet Traffic</span>
              </div>
            </div>

            {/* Flow diagram using CSS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Front Door */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2 border-2 border-blue-200">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900">Azure</div>
                  <div className="font-medium text-sm text-gray-900">Front Door</div>
                  <div className="text-xs text-gray-600">CDN & WAF</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <div className="w-8 h-0.5 bg-gray-400 relative">
                  <div className="absolute right-0 top-0 w-2 h-2 bg-gray-400 transform rotate-45 -translate-y-1/2"></div>
                </div>
              </div>

              {/* App Gateway */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2 border-2 border-green-200">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900">Application</div>
                  <div className="font-medium text-sm text-gray-900">Gateway</div>
                  <div className="text-xs text-gray-600">Load Balancer</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <div className="w-8 h-0.5 bg-gray-400 relative">
                  <div className="absolute right-0 top-0 w-2 h-2 bg-gray-400 transform rotate-45 -translate-y-1/2"></div>
                </div>
              </div>

              {/* App Service */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-2 border-2 border-purple-200">
                  <Server className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900">App Service</div>
                  <div className="font-medium text-sm text-gray-900">Node.js API</div>
                  <div className="text-xs text-gray-600">Backend</div>
                </div>
              </div>
            </div>

            {/* Backend Services */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-600">Backend Services</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">MySQL Database</div>
                    <div className="text-sm text-gray-600">Document & Todo data</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Storage Account</div>
                    <div className="text-sm text-gray-600">File & blob storage</div>
                  </div>
                </div>
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
                  className="bg-gray-50 p-4 rounded-lg border"
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

          {/* Technical Details */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Architecture Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="space-y-1">
                <li>• High availability across multiple regions</li>
                <li>• Auto-scaling based on demand</li>
                <li>• Built-in security and compliance</li>
              </ul>
              <ul className="space-y-1">
                <li>• Integrated monitoring and logging</li>
                <li>• CI/CD pipeline with Azure DevOps</li>
                <li>• Disaster recovery capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default InfrastructureDiagram
