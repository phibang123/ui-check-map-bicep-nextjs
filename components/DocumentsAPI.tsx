'use client'

import { motion } from 'framer-motion'
import { FileText, List, Link, Download, Calendar, HardDrive, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import { getApiUrl, API_CONFIG } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

interface Document {
  name: string
  size: number
  lastModified: string
}

interface DocumentsResponse {
  success: boolean
  containerName: string
  blobs: Document[]
  error?: string
}

interface SasResponse {
  success: boolean
  blobName: string
  sasUrl: string
  error?: string
}

export default function DocumentsAPI() {
  const { t } = useLanguage()
  const [documents, setDocuments] = useState<DocumentsResponse | null>(null)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const [sasUrls, setSasUrls] = useState<Record<string, string>>({})
  const [isGeneratingSas, setIsGeneratingSas] = useState<Record<string, boolean>>({})

  const fetchDocuments = async () => {
    setIsLoadingDocuments(true)
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS))
      const data = await response.json()
      setDocuments(data)
      
      if (data.success) {
        toast.success(`Đã tải ${data.blobs.length} documents thành công!`)
      } else {
        toast.error(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể tải danh sách documents')
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  const generateSasUrl = async (blobName: string) => {
    setIsGeneratingSas(prev => ({ ...prev, [blobName]: true }))
    try {
      const response = await fetch(getApiUrl(`/api/documents/sas/${blobName}`))
      const data: SasResponse = await response.json()
      
      if (data.success) {
        setSasUrls(prev => ({ ...prev, [blobName]: data.sasUrl }))
        toast.success(`Đã tạo SAS URL cho ${blobName}`)
      } else {
        toast.error(`Lỗi tạo SAS: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể tạo SAS URL')
    } finally {
      setIsGeneratingSas(prev => ({ ...prev, [blobName]: false }))
    }
  }

  const testSasEndpoint = async () => {
    const testBlobName = "documents"
    setIsGeneratingSas(prev => ({ ...prev, [testBlobName]: true }))
    try {
      const response = await fetch(getApiUrl(`/api/documents/sas/${testBlobName}`))
      const data: SasResponse = await response.json()
      
      if (data.success) {
        setSasUrls(prev => ({ ...prev, [testBlobName]: data.sasUrl }))
        toast.success(`Đã test SAS endpoint với blobName: ${testBlobName}`)
      } else {
        toast.error(`Lỗi test SAS: ${data.error}`)
      }
    } catch (error) {
      toast.error('Không thể test SAS endpoint')
    } finally {
      setIsGeneratingSas(prev => ({ ...prev, [testBlobName]: false }))
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

  useEffect(() => {
    fetchDocuments()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Documents API</h3>
            <p className="text-gray-600">Quản lý documents trong Azure Storage</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={testSasEndpoint}
            disabled={isGeneratingSas["documents"]}
            className="btn-primary disabled:opacity-50"
          >
            {isGeneratingSas["documents"] ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang test...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link className="w-4 h-4" />
                <span>Test SAS</span>
              </div>
            )}
          </button>
          
          <button
            onClick={fetchDocuments}
            disabled={isLoadingDocuments}
            className="btn-secondary disabled:opacity-50"
          >
            {isLoadingDocuments ? (
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

      {documents && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Container Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <HardDrive className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Container</h4>
            </div>
            <p className="font-mono text-sm text-gray-700 bg-white px-2 py-1 rounded border">
              {documents.containerName}
            </p>
          </div>

          {/* Documents List */}
          {documents.blobs && documents.blobs.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Documents ({documents.blobs.length})</span>
              </h4>
              
              <div className="space-y-3">
                {documents.blobs.map((doc, index) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <h5 className="font-semibold text-gray-900 truncate">{doc.name}</h5>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <HardDrive className="w-3 h-3" />
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(doc.lastModified)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {sasUrls[doc.name] ? (
                          <a
                            href={sasUrls[doc.name]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Mở</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => generateSasUrl(doc.name)}
                            disabled={isGeneratingSas[doc.name]}
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                          >
                            {isGeneratingSas[doc.name] ? (
                              <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Link className="w-4 h-4" />
                            )}
                            <span>
                              {isGeneratingSas[doc.name] ? 'Đang tạo...' : 'Tạo SAS'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không có documents nào trong container</p>
            </div>
          )}

          {/* Test SAS Endpoint Info */}
          {sasUrls["documents"] && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ SAS Endpoint Test Result</h4>
              <div className="space-y-2">
                <p className="text-green-800 text-sm">
                  <strong>Blob Name:</strong> documents
                </p>
                <p className="text-green-800 text-sm">
                  <strong>SAS URL:</strong> 
                </p>
                <div className="p-2 bg-white rounded border">
                  <code className="text-xs text-gray-700 break-all">
                    {sasUrls["documents"]}
                  </code>
                </div>
                <a
                  href={sasUrls["documents"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-green-700 hover:text-green-800 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Mở SAS URL</span>
                </a>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Về Documents API</h4>
            <p className="text-blue-800 text-sm">
              API này sử dụng Managed Identity để truy cập Azure Storage. 
              SAS URLs được tạo với Account Key và có thời hạn 1 giờ mặc định.
            </p>
            <p className="text-blue-800 text-sm mt-2">
              <strong>{t('documents.testSasEndpoint')}:</strong> {t('documents.testSasDescription')} 
              <code className="bg-blue-100 px-1 rounded">/api/documents/sas/documents</code>
            </p>
          </div>
        </motion.div>
      )}

      {!documents && !isLoadingDocuments && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có dữ liệu documents</p>
        </div>
      )}
    </motion.div>
  )
}
