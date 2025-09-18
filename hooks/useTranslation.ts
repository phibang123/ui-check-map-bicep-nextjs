'use client'

import { useState, useEffect, useCallback } from 'react'
import { Locale, getTranslation, getSupportedLocales, getLocaleName } from '@/lib/i18n'

export const useTranslation = () => {
  const [locale, setLocale] = useState<Locale>('vi')
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('kin241-locale') as Locale
    if (savedLocale && getSupportedLocales().includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('kin241-locale', newLocale)
    // Force re-render by updating a state
    setForceUpdate(prev => prev + 1)
  }, [])

  const t = useCallback((key: string) => {
    return getTranslation(locale, key)
  }, [locale, forceUpdate])

  return {
    locale,
    changeLocale,
    t,
    supportedLocales: getSupportedLocales(),
    getLocaleName
  }
}
