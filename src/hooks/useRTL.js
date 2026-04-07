import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Custom hook to detect and track RTL direction changes
 * Returns boolean indicating if current language is RTL
 */
export const useRTL = () => {
  const { i18n } = useTranslation()
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar')

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      const rtl = lng === 'ar'
      setIsRTL(rtl)
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  return isRTL
}

export default useRTL
