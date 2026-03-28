import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-8 bg-primary-800 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">Nord Sud Action</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-primary-300">{t('footerText')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('footerContact')}</p>
          <p className="mt-2 text-sm text-primary-300">contact@nordsudaction.org</p>
          <p className="text-sm text-primary-300">+212 600 000 000</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('footerSocial')}</p>
          <div className="mt-2 flex flex-col gap-2 text-sm text-primary-300 sm:flex-row sm:flex-wrap sm:gap-3">
            <a className="transition-all duration-300 md:hover:text-secondary-500" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a className="transition-all duration-300 md:hover:text-secondary-500" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="transition-all duration-300 md:hover:text-secondary-500" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-700 px-4 py-4 text-center text-xs leading-5 text-primary-400 sm:px-6">
        &copy; {new Date().getFullYear()} Nord Sud Action. {t('footerCopyright')}
      </div>
    </footer>
  )
}

export default Footer
