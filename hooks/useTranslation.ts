'use client'

import { useState, useEffect } from 'react'
import { Locale, getTranslation, getSupportedLocales, getLocaleName } from '@/lib/i18n'

export const useTranslation = () => {
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

  return {
    locale,
    changeLocale,
    t,
    supportedLocales: getSupportedLocales(),
    getLocaleName
  }
}
