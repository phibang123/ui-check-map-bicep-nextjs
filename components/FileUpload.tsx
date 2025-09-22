'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  File, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Camera,
  Paperclip,
  Trash2,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useLanguage } from '@/contexts/LanguageContext'
import { getApiUrl, API_CONFIG } from '@/lib/config'

interface FileWithPreview extends File {
  preview?: string
  id: string
}

interface UploadResult {
  success: boolean
  document?: any
  error?: string
  logicAppResult?: any
}

interface FileUploadProps {
  onUploadSuccess?: () => void
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps = {}) {
  const { t } = useLanguage()
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Supported file types
  const supportedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ]

  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const validateFile = (file: File): boolean => {
    if (!supportedTypes.includes(file.type)) {
      toast.error(`${t('fileUpload.uploadError')}: ${file.name} - ${t('fileUpload.supportedFormats')}`)
      return false
    }
    if (file.size > maxFileSize) {
      toast.error(`${t('fileUpload.uploadError')}: ${file.name} - ${t('fileUpload.maxSize')}`)
      return false
    }
    return true
  }

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles: FileWithPreview[] = []

    fileArray.forEach(file => {
      if (validateFile(file)) {
        const fileWithPreview: FileWithPreview = Object.assign(file, {
          id: `${Date.now()}-${Math.random()}`,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        })
        validFiles.push(fileWithPreview)
      }
    })

    setSelectedFiles(prev => [...prev, ...validFiles])
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== fileId)
      // Revoke object URL for images to prevent memory leaks
      const fileToRemove = prev.find(file => file.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return updatedFiles
    })
  }

  const uploadSingleFile = async (file: FileWithPreview): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_UPLOAD), {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }


  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error(t('fileUpload.noFilesSelected'))
      return
    }

    setIsUploading(true)
    setUploadResults([])

    try {
      // Upload files one by one
      const results: UploadResult[] = []
      for (const file of selectedFiles) {
        const result = await uploadSingleFile(file)
        results.push(result)
      }

      setUploadResults(results)

      const successCount = results.filter(r => r.success).length
      const totalCount = results.length

      if (successCount === totalCount) {
        toast.success(`${t('fileUpload.uploadSuccess')} (${successCount}/${totalCount})`)
        // Clear selected files after successful upload
        selectedFiles.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview)
          }
        })
        setSelectedFiles([])
        // Call callback to notify parent component
        onUploadSuccess?.()
      } else {
        toast.error(`${t('fileUpload.uploadError')}: ${successCount}/${totalCount} files`)
      }
    } catch (error) {
      toast.error(t('fileUpload.uploadError'))
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-600" />
    }
    if (file.type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-600" />
    }
    if (file.type.includes('word')) {
      return <FileText className="w-5 h-5 text-blue-600" />
    }
    return <File className="w-5 h-5 text-gray-600" />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('fileUpload.title')}</h3>
              <p className="text-gray-600">{t('fileUpload.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <motion.div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 hover:shadow-xl ${
            isDragOver 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-purple-100 rounded-full">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {t('fileUpload.dragDrop')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t('fileUpload.supportedFormats')}
              </p>
              <p className="text-sm text-gray-500">
                {t('fileUpload.maxSize')}
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4 mr-2" />
              {t('fileUpload.selectFiles')}
            </button>
          </div>
        </motion.div>

        {/* Selected Files */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <h4 className="font-semibold text-gray-900 mb-4">
                {t('fileUpload.selectedFiles')} ({selectedFiles.length})
              </h4>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    {file.preview ? (
                      <div className="flex-shrink-0">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 p-2 bg-white rounded border">
                        {getFileIcon(file)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-gray-400"
                      title={t('fileUpload.removeFile')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Upload Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="btn-primary disabled:opacity-50 flex-1"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('fileUpload.uploadProgress')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>{t('fileUpload.uploadSingle')}</span>
                    </div>
                  )}
                </button>
                

                <button
                  onClick={() => {
                    selectedFiles.forEach(file => {
                      if (file.preview) {
                        URL.revokeObjectURL(file.preview)
                      }
                    })
                    setSelectedFiles([])
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Results */}
        <AnimatePresence>
          {uploadResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6"
            >
              <h4 className="font-semibold text-gray-900 mb-4">{t('fileUpload.results')}</h4>
              <div className="space-y-2">
                {uploadResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      {result.success ? (
                        <div>
                          <p className="font-medium text-green-900">
                            {result.document?.originalName || `File ${index + 1}`}
                          </p>
                          <p className="text-sm text-green-700">
                            ID: {result.document?.id} • {t('fileUpload.uploadSuccess')}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-red-900">{t('fileUpload.uploadError')}</p>
                          <p className="text-sm text-red-700">{result.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
