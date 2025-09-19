'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  List, 
  BarChart3, 
  Download, 
  Trash2,
  Users, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Database,
  Cloud
} from 'lucide-react'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import toast from 'react-hot-toast'

import { getApiUrl, API_CONFIG, getFetchOptions } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

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


const DocumentManagement = forwardRef<any, {}>((props, ref) => {
  const { t } = useLanguage()
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS), getFetchOptions('GET'))
      const data: DocumentsResponse = await response.json()
      console.log(data, 'data')
      
      if (data.success) {
        setDocuments(data.documents || [])
        toast.success(data.message || `${t('common.success')}: ${data.documents?.length || 0} documents`)
      } else {
        toast.error(data.message || `${t('common.error')}: ${data.error}`)
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_STATS), getFetchOptions('GET'))
      const data: DocumentStats = await response.json()
      
      if (data.success) {
        setStats(data)
        toast.success(data.message || t('common.success'))
      } else {
        toast.error(data.message || `${t('common.error')}: ${data.error}`)
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setIsLoadingStats(false)
    }
  }

  const downloadDocument = async (documentId: number, filename: string) => {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_DOWNLOAD.replace(':id', documentId.toString()))
      const response = await fetch(url, getFetchOptions('GET'))
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Create blob from response
      const blob = await response.blob()
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      toast.success(data.message || `${t('common.success')}: ${t('documents.downloadFile')}`)
    } catch (error) {
      console.error('❌ Download failed:', error)
      toast.error(`${t('common.error')}: ${error instanceof Error ? error.message : 'Download failed'}`)
    }
  }

  const deleteDocument = async (documentId: number, fileName: string) => {
    if (!window.confirm(`${t('documents.confirmDelete')} "${fileName}"?`)) {
      return
    }

    try {
      const response = await fetch(
        getApiUrl(`${API_CONFIG.ENDPOINTS.DOCUMENTS}/${documentId}`),
        getFetchOptions('DELETE')
      )

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || `${t('common.success')}: ${t('documents.deleteSuccess')}`)
        // Refresh documents list and stats
        await fetchDocuments()
        await fetchStats()
      } else {
        toast.error(data.message || `${t('common.error')}: ${data.error || 'Delete failed'}`)
      }
    } catch (error) {
      console.error('❌ Delete failed:', error)
      toast.error(`${t('common.error')}: ${error instanceof Error ? error.message : 'Delete failed'}`)
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
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'pending': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  useEffect(() => {
    fetchDocuments()
    fetchStats()
  }, [])

  useImperativeHandle(ref, () => ({
    fetchDocuments
  }))

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
              <h3 className="text-xl font-bold text-gray-900">{t('documents.title')}</h3>
              <p className="text-gray-600">{t('documents.subtitle')}</p>
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
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>{t('common.refresh')}</span>
                </div>
              )}
            </button>
          </div>
        </div>


        {/* Statistics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">{t('documents.statistics')}</h4>
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
                <div className="text-sm text-blue-800">{t('documents.totalDocuments')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.statistics.byStatus.completed || 0}
                </div>
                <div className="text-sm text-green-800">{t('documents.processed')}</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.statistics.byStatus.pending || 0}
                </div>
                <div className="text-sm text-yellow-800">{t('documents.pending')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatFileSize(stats.statistics.totalSize)}
                </div>
                <div className="text-sm text-purple-800">{t('documents.totalSize')}</div>
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
                        onClick={() => downloadDocument(doc.id, doc.originalName)}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t('documents.download')}</span>
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id, doc.originalName)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t('documents.delete')}</span>
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
            <p className="text-gray-500">{t('documents.noDocuments')}</p>
          </div>
        )}
      </div>
    </div>
  )
})

export default DocumentManagement
