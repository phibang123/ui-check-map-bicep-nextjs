'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, getTranslation, getSupportedLocales, getLocaleName } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  changeLocale: (locale: Locale) => void
  t: (key: string) => string
  supportedLocales: Locale[]
  getLocaleName: (locale: Locale) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('vi')

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('kin241-locale') as Locale
    if (savedLocale && getSupportedLocales().includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('kin241-locale', newLocale)
  }

  const t = (key: string) => {
    return getTranslation(locale, key)
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        changeLocale,
        t,
        supportedLocales: getSupportedLocales(),
        getLocaleName
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

