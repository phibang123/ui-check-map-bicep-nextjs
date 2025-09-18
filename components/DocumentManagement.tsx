'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  List, 
  BarChart3, 
  Play, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Database,
  Cloud
} from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import { getApiUrl, API_CONFIG } from '@/lib/config'

interface Document {
  id: number
  filename: string
  originalName: string
  mimeType: string
  fileSize: number
  status: string
  uploadedAt: string
  blobUrl?: string
  fileSharePath?: string
  processedAt?: string
  logicAppResponse?: any
}

interface DocumentsResponse {
  success: boolean
  documents: Document[]
  total: number
  error?: string
}

interface DocumentStats {
  success: boolean
  statistics: {
    total: number
    byStatus: Record<string, number>
    byMimeType: Record<string, number>
    totalSize: number
  }
  error?: string
}

interface LogicAppStatus {
  success: boolean
  logicAppStatus: {
    configured: boolean
    triggerUrls: any
    baseUrl: string
  }
  error?: string
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [logicAppStatus, setLogicAppStatus] = useState<LogicAppStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingLogicApp, setIsLoadingLogicApp] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS))
      const data: DocumentsResponse = await response.json()
      
      if (data.success) {
        setDocuments(data.documents || [])
        toast.success(`Đã tải ${data.documents?.length || 0} documents`)
      } else {
        toast.error(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể tải danh sách documents')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_STATS))
      const data: DocumentStats = await response.json()
      
      if (data.success) {
        setStats(data)
        toast.success('Đã tải thống kê documents')
      } else {
        toast.error(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể tải thống kê')
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchLogicAppStatus = async () => {
    setIsLoadingLogicApp(true)
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIC_APP_STATUS))
      const data: LogicAppStatus = await response.json()
      
      if (data.success) {
        setLogicAppStatus(data)
        toast.success('Đã tải trạng thái Logic App')
      } else {
        toast.error(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể tải trạng thái Logic App')
    } finally {
      setIsLoadingLogicApp(false)
    }
  }

  const processDocument = async (documentId: number) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_PROCESS.replace(':id', documentId.toString())), {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Đã trigger Logic App cho document ${documentId}`)
        fetchDocuments() // Refresh list
      } else {
        toast.error(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể process document')
    }
  }

  const processBulkDocuments = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Vui lòng chọn documents để process')
      return
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_BULK_PROCESS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ documentIds: selectedDocuments })
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Đã process ${data.successfulDocuments}/${data.totalDocuments} documents`)
        setSelectedDocuments([])
        fetchDocuments() // Refresh list
      } else {
        toast.error(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể process bulk documents')
    }
  }

  const testLogicAppConnection = async () => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIC_APP_TEST), {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Logic App connection test thành công!')
      } else {
        toast.error(`Logic App test thất bại: ${data.testResult?.error}`)
      }
    } catch (error) {
      toast.error('Không thể test Logic App connection')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'pending': return 'text-blue-600 bg-blue-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  useEffect(() => {
    fetchDocuments()
    fetchStats()
    fetchLogicAppStatus()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Document Management</h3>
              <p className="text-gray-600">Quản lý documents với Logic App integration</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDocuments}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>Làm mới</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Logic App Status */}
        {logicAppStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cloud className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Logic App Status</h4>
                  <p className="text-sm text-gray-600">
                    {logicAppStatus.logicAppStatus.configured ? 'Đã cấu hình' : 'Chưa cấu hình'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={testLogicAppConnection}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  Test Connection
                </button>
                <button
                  onClick={fetchLogicAppStatus}
                  disabled={isLoadingLogicApp}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                >
                  {isLoadingLogicApp ? '...' : 'Refresh'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Statistics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Document Statistics</h4>
              <button
                onClick={fetchStats}
                disabled={isLoadingStats}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                {isLoadingStats ? '...' : 'Refresh'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.statistics.total}</div>
                <div className="text-sm text-blue-800">Total Documents</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.statistics.byStatus.processed || 0}
                </div>
                <div className="text-sm text-green-800">Processed</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.statistics.byStatus.pending || 0}
                </div>
                <div className="text-sm text-yellow-800">Pending</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatFileSize(stats.statistics.totalSize)}
                </div>
                <div className="text-sm text-purple-800">Total Size</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documents List */}
        {documents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Documents ({documents.length})</span>
              </h4>
              
              {selectedDocuments.length > 0 && (
                <button
                  onClick={processBulkDocuments}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Process Selected ({selectedDocuments.length})</span>
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocuments([...selectedDocuments, doc.id])
                          } else {
                            setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id))
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <h5 className="font-semibold text-gray-900">{doc.originalName}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(doc.status)}`}>
                            {getStatusIcon(doc.status)}
                            <span>{doc.status}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Database className="w-3 h-3" />
                            <span>{formatFileSize(doc.fileSize)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(doc.uploadedAt)}</span>
                          </div>
                          {doc.processedAt && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Processed: {formatDate(doc.processedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => processDocument(doc.id)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <Play className="w-4 h-4" />
                        <span>Process</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có documents nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
