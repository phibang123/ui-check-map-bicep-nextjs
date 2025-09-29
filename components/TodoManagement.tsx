'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useLanguage } from '../contexts/LanguageContext'
import { API_CONFIG, getApiUrl, getFetchOptions } from '../lib/config'
import LoadingSpinner from './LoadingSpinner'

interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface TodoStats {
  total: number
  completed: number
  pending: number
  byPriority: {
    high: number
    medium: number
    low: number
  }
  byCategory: Record<string, number>
  totalCategories: number
}

interface TodoFormData {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate: string
}

const TodoManagement: React.FC = () => {
  const { t } = useLanguage()
  const [todos, setTodos] = useState<Todo[]>([])
  const [stats, setStats] = useState<TodoStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [selectedTodos, setSelectedTodos] = useState<number[]>([])
  const [filters, setFilters] = useState({
    completed: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  })
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; todo: Todo | null }>({
    show: false,
    todo: null
  })
  const [bulkConfirm, setBulkConfirm] = useState<{ show: boolean; action: string }>({
    show: false,
    action: ''
  })

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: ''
  })

  // Load todos and stats
  useEffect(() => {
    loadTodos()
    loadStats()
  }, [filters])

  const loadTodos = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters.completed !== 'all') {
        queryParams.append('completed', filters.completed === 'completed' ? 'true' : 'false')
      }
      if (filters.priority !== 'all') {
        queryParams.append('priority', filters.priority)
      }
      if (filters.category !== 'all') {
        queryParams.append('category', filters.category)
      }
      if (filters.search) {
        queryParams.append('search', filters.search)
      }

      const url = getApiUrl(`${API_CONFIG.ENDPOINTS.TODOS}?${queryParams.toString()}`)
      const response = await fetch(url, getFetchOptions())

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        setTodos(data.todos || [])
      } else {
        throw new Error(data.error || 'Failed to load todos')
      }
    } catch (err) {
      console.error('❌ Failed to load todos:', err)
      setError(err instanceof Error ? err.message : 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.TODOS_STATS)
      const response = await fetch(url, getFetchOptions())

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.statistics)
        }
      }
    } catch (err) {
      console.error('❌ Failed to load todo stats:', err)
    }
  }

  const createTodo = async (todoData: TodoFormData) => {
    try {
      setLoading(true)
      setError(null)

      const url = getApiUrl(API_CONFIG.ENDPOINTS.TODOS)
      const response = await fetch(url, getFetchOptions('POST', todoData))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        await loadTodos()
        await loadStats()
        resetForm()
        setShowForm(false)
      } else {
        throw new Error(data.error || 'Failed to create todo')
      }
    } catch (err) {
      console.error('❌ Failed to create todo:', err)
      setError(err instanceof Error ? err.message : 'Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  const updateTodo = async (id: number, todoData: Partial<TodoFormData>) => {
    try {
      setLoading(true)
      setError(null)

      const url = getApiUrl(`${API_CONFIG.ENDPOINTS.TODOS}/${id}`)
      const response = await fetch(url, getFetchOptions('PUT', todoData))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        await loadTodos()
        await loadStats()
        resetForm()
        setEditingTodo(null)
        setShowForm(false)
      } else {
        throw new Error(data.error || 'Failed to update todo')
      }
    } catch (err) {
      console.error('❌ Failed to update todo:', err)
      setError(err instanceof Error ? err.message : 'Failed to update todo')
    } finally {
      setLoading(false)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const url = getApiUrl(`${API_CONFIG.ENDPOINTS.TODOS}/${id}`)
      const response = await fetch(url, getFetchOptions('DELETE'))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        toast.success(data.message || t('todos.deleteSuccess'))
        await loadTodos()
        await loadStats()
      } else {
        throw new Error(data.error || 'Failed to delete todo')
      }
    } catch (err) {
      console.error('❌ Failed to delete todo:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
      toast.error(err instanceof Error ? err.message : 'Failed to delete todo')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.todo) {
      await deleteTodo(deleteConfirm.todo.id)
      setDeleteConfirm({ show: false, todo: null })
    }
  }

  const toggleTodo = async (id: number) => {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.TODOS_TOGGLE.replace(':id', id.toString()))
      const response = await fetch(url, getFetchOptions('PATCH'))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        await loadTodos()
        await loadStats()
      } else {
        throw new Error(data.error || 'Failed to toggle todo')
      }
    } catch (err) {
      console.error('❌ Failed to toggle todo:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle todo')
    }
  }

  const bulkAction = async (action: 'complete' | 'incomplete' | 'delete') => {
    if (selectedTodos.length === 0) return

    try {
      setLoading(true)
      setError(null)

      const url = getApiUrl(API_CONFIG.ENDPOINTS.TODOS_BULK)
      const response = await fetch(url, getFetchOptions('POST', {
        todoIds: selectedTodos,
        action: action
      }))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        toast.success(data.message || `${t('todos.bulkActionSuccess')}: ${selectedTodos.length} todos`)
        await loadTodos()
        await loadStats()
        setSelectedTodos([])
      } else {
        throw new Error(data.error || `Failed to ${action} todos`)
      }
    } catch (err) {
      console.error(`❌ Failed to ${action} todos:`, err)
      setError(err instanceof Error ? err.message : `Failed to ${action} todos`)
      toast.error(err instanceof Error ? err.message : `Failed to ${action} todos`)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = (action: string) => {
    setBulkConfirm({ show: true, action })
  }

  const handleBulkConfirm = async () => {
    if (bulkConfirm.action) {
      await bulkAction(bulkConfirm.action as 'complete' | 'incomplete' | 'delete')
      setBulkConfirm({ show: false, action: '' })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: ''
    })
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      category: todo.category,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (editingTodo) {
      updateTodo(editingTodo.id, formData)
    } else {
      createTodo(formData)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUniqueCategories = () => {
    const categorySet = new Set(todos.map(todo => todo.category).filter(Boolean))
    const categories = Array.from(categorySet)
    return categories.sort()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg border border-gray-200 p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300"
    >
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('todos.title')}</h2>
          <p className="text-gray-600 mt-1">{t('todos.subtitle')}</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setEditingTodo(null)
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('todos.addTodo')}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg hover:shadow-md transition-all duration-300">
            <h3 className="font-semibold text-blue-900">{t('todos.totalTodos')}</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg hover:shadow-md transition-all duration-300">
            <h3 className="font-semibold text-green-900">{t('todos.completed')}</h3>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg hover:shadow-md transition-all duration-300">
            <h3 className="font-semibold text-orange-900">{t('todos.pending')}</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg hover:shadow-md transition-all duration-300">
            <h3 className="font-semibold text-purple-900">{t('todos.categories')}</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.totalCategories}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.status')}
            </label>
            <select
              value={filters.completed}
              onChange={(e) => setFilters(prev => ({ ...prev, completed: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All</option>
              <option value="completed">{t('todos.completed')}</option>
              <option value="pending">{t('todos.pending')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('todos.priority')}
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All</option>
              <option value="high">{t('todos.priorities.high')}</option>
              <option value="medium">{t('todos.priorities.medium')}</option>
              <option value="low">{t('todos.priorities.low')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('todos.category')}
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('todos.search')}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder={t('todos.search')}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>


      {/* Todo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTodo ? t('todos.editTodo') : t('todos.create')}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingTodo(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('todos.form.title')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('todos.form.titlePlaceholder')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('todos.form.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('todos.form.descriptionPlaceholder')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('todos.form.priority')}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="low">{t('todos.priorities.low')}</option>
                    <option value="medium">{t('todos.priorities.medium')}</option>
                    <option value="high">{t('todos.priorities.high')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('todos.form.category')}
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder={t('todos.form.categoryPlaceholder')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('todos.form.dueDate')}
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTodo(null)
                    resetForm()
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {t('todos.form.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {loading ? t('common.loading') : (editingTodo ? t('todos.form.updateTodo') : t('todos.form.createTodo'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Todos List */}
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="p-4 border-b border-gray-200 min-h-[60px]">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">{t('todos.list')}</h3>
              {todos.length > 0 && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTodos.length === todos.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTodos(todos.map(todo => todo.id))
                      } else {
                        setSelectedTodos([])
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{t('todos.selectAll')}</span>
                </label>
              )}
            </div>
            
            {/* Selection Info & Bulk Actions - Fixed height container */}
            <div className="flex items-center space-x-4 min-h-[32px]">
              {selectedTodos.length > 0 ? (
                <>
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-blue-900 font-medium text-sm">
                      {selectedTodos.length} selected
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleBulkAction('complete')}
                      className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                      title={t('todos.completeSelected')}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Complete</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('incomplete')}
                      className="bg-orange-600 text-white px-2.5 py-1 rounded text-xs font-medium hover:bg-orange-700 transition-colors flex items-center space-x-1"
                      title={t('todos.incompleteSelected')}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Incomplete</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors flex items-center space-x-1"
                      title={t('todos.deleteSelected')}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-0"></div>
              )}
            </div>
          </div>
        </div>

        {todos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">{t('todos.noTodos')}</p>
            <p className="text-sm text-gray-500">{t('todos.getStarted')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {todos.map((todo) => (
              <div key={todo.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTodos.includes(todo.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTodos(prev => [...prev, todo.id])
                        } else {
                          setSelectedTodos(prev => prev.filter(id => id !== todo.id))
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                      {t(`todos.priorities.${todo.priority}`)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`p-1 rounded ${
                        todo.completed 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={todo.completed ? t('todos.markIncomplete') : t('todos.markComplete')}
                    >
                      {todo.completed ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title={t('common.edit')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ show: true, todo })}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title={t('common.delete')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className={`font-medium text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {todo.title}
                  </h4>
                  {todo.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{todo.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      {todo.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {todo.category}
                        </span>
                      )}
                      {todo.dueDate && (
                        <span className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {todo.completed ? t('todos.completed') : t('todos.pending')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('todos.confirmDelete')}</h3>
                <p className="text-sm text-gray-600">{t('todos.deleteWarning')}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="font-medium text-gray-900">{deleteConfirm.todo?.title}</p>
              {deleteConfirm.todo?.description && (
                <p className="text-sm text-gray-600 mt-1">{deleteConfirm.todo.description}</p>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, todo: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      {bulkConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('todos.bulkConfirm')}</h3>
                <p className="text-sm text-gray-600">
                  {bulkConfirm.action === 'delete' 
                    ? t('todos.bulkDeleteWarning').replace('{count}', selectedTodos.length.toString())
                    : t('todos.bulkActionWarning').replace('{action}', bulkConfirm.action).replace('{count}', selectedTodos.length.toString())
                  }
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="font-medium text-gray-900">
                {selectedTodos.length} todo(s) will be {bulkConfirm.action}ed
              </p>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setBulkConfirm({ show: false, action: '' })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleBulkConfirm}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  bulkConfirm.action === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : bulkConfirm.action === 'complete'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </motion.div>
  )
}

export default TodoManagement
