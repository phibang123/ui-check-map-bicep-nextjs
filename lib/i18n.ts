import vi from './locales/vi.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

export type Locale = 'vi' | 'en' | 'ja'

export const locales: Record<Locale, any> = {
  vi,
  en,
  ja
}

export const defaultLocale: Locale = 'vi'

export const getLocaleData = (locale: Locale) => {
  return locales[locale] || locales[defaultLocale]
}

export const getTranslation = (locale: Locale, key: string) => {
  const data = getLocaleData(locale)
  const keys = key.split('.')
  let result: any = data
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  return result
}

export const getSupportedLocales = (): Locale[] => {
  return Object.keys(locales) as Locale[]
}

export const getLocaleName = (locale: Locale): string => {
  const names: Record<Locale, string> = {
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語'
  }
  return names[locale]
}

