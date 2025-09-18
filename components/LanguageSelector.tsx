'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Locale } from '@/lib/i18n'

export default function LanguageSelector() {
  const { locale, changeLocale, supportedLocales, getLocaleName } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    changeLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {getLocaleName(locale)}
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div className="py-1">
            {supportedLocales.map((supportedLocale) => (
              <button
                key={supportedLocale}
                onClick={() => handleLocaleChange(supportedLocale)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{getLocaleName(supportedLocale)}</span>
                {locale === supportedLocale && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
