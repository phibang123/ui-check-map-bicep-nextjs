'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Server, Database, Shield, Globe, Maximize2, Minimize2, Zap, HardDrive, MessageSquare, Table, Route, Lock, Network, Layers } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const InfrastructureDiagram: React.FC = () => {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

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
          {/* Infrastructure Diagram - Placeholder for now */}
          <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">{t('infrastructure.internetTraffic') || 'Internet Traffic'}</span>
              </div>
            </div>

            {/* Main Flow diagram */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-8">
              {/* Front Door */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2 border-2 border-blue-200">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900">{t('infrastructure.frontDoor') || 'Azure Front Door'}</div>
                  <div className="text-xs text-gray-600">{t('infrastructure.cdnWaf') || 'CDN & WAF'}</div>
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
                  <div className="font-medium text-sm text-gray-900">{t('infrastructure.appGateway') || 'Application Gateway'}</div>
                  <div className="text-xs text-gray-600">{t('infrastructure.loadBalancer') || 'Load Balancer'}</div>
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
                  <div className="font-medium text-sm text-gray-900">{t('infrastructure.appService') || 'App Service'}</div>
                  <div className="font-medium text-sm text-gray-900">{t('infrastructure.nodejsApi') || 'Node.js API'}</div>
                  <div className="text-xs text-gray-600">{t('infrastructure.backend') || 'Backend'}</div>
                </div>
              </div>
            </div>

            {/* Logic App Flow */}
            <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-yellow-800">{t('infrastructure.logicAppWorkflow') || 'Logic App Workflow'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* App Service to Logic App */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2 border-2 border-purple-200">
                    <Server className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.appService') || 'App Service'}</div>
                    <div className="text-xs text-gray-600">{t('infrastructure.triggers') || 'Triggers'}</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center">
                  <div className="w-8 h-0.5 bg-yellow-400 relative">
                    <div className="absolute right-0 top-0 w-2 h-2 bg-yellow-400 transform rotate-45 -translate-y-1/2"></div>
                  </div>
                </div>

                {/* Logic App */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 border-2 border-yellow-200">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.logicApp') || 'Logic App'}</div>
                    <div className="text-xs text-gray-600">{t('infrastructure.workflow') || 'Workflow'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Services */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-600">{t('infrastructure.backendServices') || 'Backend Services'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('infrastructure.database') || 'MySQL Database'}</div>
                    <div className="text-sm text-gray-600">{t('infrastructure.databaseDesc') || 'Document & Todo data'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('infrastructure.logicApp') || 'Logic App'}</div>
                    <div className="text-sm text-gray-600">{t('infrastructure.logicAppDesc') || 'Workflow automation'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Endpoints */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-600">{t('infrastructure.privateEndpoints') || 'Private Endpoints (6 PEs)'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Server className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.appService') || 'App Service'}</div>
                    <div className="text-xs text-gray-600">PE 1</div>
                  </div>
                </div>
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                    <HardDrive className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.fileStorage') || 'File Storage'}</div>
                    <div className="text-xs text-gray-600">PE 2</div>
                  </div>
                </div>
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-2">
                    <MessageSquare className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.queueStorage') || 'Queue Storage'}</div>
                    <div className="text-xs text-gray-600">PE 3</div>
                  </div>
                </div>
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.logicApp') || 'Logic App'}</div>
                    <div className="text-xs text-gray-600">PE 4</div>
                  </div>
                </div>
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-2">
                    <Cloud className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.blobStorage') || 'Blob Storage'}</div>
                    <div className="text-xs text-gray-600">PE 5</div>
                  </div>
                </div>
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                    <Table className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs text-gray-900">{t('infrastructure.tableStorage') || 'Table Storage'}</div>
                    <div className="text-xs text-gray-600">PE 6</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Security */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-600">{t('infrastructure.networkSecurity') || 'Network Security'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Network className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('infrastructure.virtualNetwork') || 'Virtual Network'}</div>
                    <div className="text-sm text-gray-600">{t('infrastructure.virtualNetworkDesc') || 'Isolated network environment'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('infrastructure.subnet') || 'Subnet'}</div>
                    <div className="text-sm text-gray-600">{t('infrastructure.subnetDesc') || 'Network segmentation'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Route className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('infrastructure.routeTable') || 'Route Table'}</div>
                    <div className="text-sm text-gray-600">{t('infrastructure.routeTableDesc') || 'Connected to App Service'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('infrastructure.firewall') || 'Firewall'}</div>
                    <div className="text-sm text-gray-600">{t('infrastructure.firewallDesc') || 'External access control'}</div>
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

          {/* Technical Details */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300">
            <h4 className="font-medium text-gray-900 mb-2">{t('infrastructure.architectureHighlights') || 'Architecture Highlights'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="space-y-1">
                <li>• {t('infrastructure.highAvailability') || 'High availability across multiple regions'}</li>
                <li>• {t('infrastructure.autoScaling') || 'Auto-scaling based on demand'}</li>
                <li>• {t('infrastructure.builtInSecurity') || 'Built-in security and compliance'}</li>
                {/* <li>• {t('infrastructure.logicAppAutomation') || 'Logic App workflow automation'}</li> */}
                <li>• {t('infrastructure.privateEndpoints') || '6 Private Endpoints for secure access'}</li>
              </ul>
              <ul className="space-y-1">
                {/* <li>• {t('infrastructure.monitoring') || 'Integrated monitoring and logging'}</li> */}
                <li>• {t('infrastructure.cicd') || 'CI/CD pipeline with Azure DevOps'}</li>
                <li>• {t('infrastructure.disasterRecovery') || 'Disaster recovery capabilities'}</li>
                <li>• {t('infrastructure.networkProtection') || 'Route table with firewall protection'}</li>
                <li>• {t('infrastructure.multipleStorage') || 'Multiple storage types (File, Queue, Blob, Table)'}</li>
                <li>• {t('infrastructure.virtualNetwork') || 'Virtual Network with Subnet segmentation'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default InfrastructureDiagram
