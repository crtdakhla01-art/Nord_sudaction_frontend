import { useTranslation } from 'react-i18next'

const langs = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'fr'

  return (
    <div
      className="inline-flex max-w-full items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
      aria-label="Language Switcher"
    >
      {langs.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={
            currentLanguage.startsWith(lang.code)
              ? 'min-h-10 rounded-md bg-secondary-500 px-2.5 py-2 text-xs font-semibold text-white transition-all duration-300 sm:px-3 sm:py-1.5'
              : 'min-h-10 rounded-md px-2.5 py-2 text-xs font-semibold text-primary-500 transition-all duration-300 md:hover:bg-primary-50 md:hover:text-primary-600 sm:px-3 sm:py-1.5'
          }
          onClick={() => i18n.changeLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
