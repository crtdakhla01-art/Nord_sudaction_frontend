import { useTranslation } from 'react-i18next'

const langs = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'ar', label: 'AR' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'fr'

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    // Direction is now handled by i18n listener in i18n/index.js
  }

  return (
    <div
      className="inline-flex max-w-full items-center gap-0.5 sm:gap-1 rounded-lg border border-secondary-100 bg-primary-50 p-0.5 sm:p-1 shadow-sm"
      aria-label="Language Switcher"
    >
      {langs.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={
            currentLanguage.startsWith(lang.code)
              ? 'min-h-7 sm:min-h-10 rounded-md bg-secondary-500 px-1.5 sm:px-2.5 py-1 sm:py-2 text-xs font-semibold text-white transition-all duration-300'
              : 'min-h-7 sm:min-h-10 rounded-md px-1.5 sm:px-2.5 py-1 sm:py-2 text-xs font-semibold text-primary-500 transition-all duration-300 md:hover:bg-primary-50 md:hover:text-primary-600'
          }
          onClick={() => handleLanguageChange(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
