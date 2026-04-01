import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpeg'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-8 bg-primary-800 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo} alt="Nord Sud Action" className="h-14 w-auto rounded-lg" loading="lazy" decoding="async" />
          <p className="mt-2 max-w-sm text-sm leading-6 text-primary-300">{t('footerText')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Pages</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link to="/" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navHome')}</Link>
            <Link to="/events" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navEvents')}</Link>
            <Link to="/actualites" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navActualites')}</Link>
            <Link to="/opportunities" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navOpportunities')}</Link>
            <Link to="/galerie" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navGallery')}</Link>
            <Link to="/contact" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navContact')}</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('footerContact')}</p>
          <p className="mt-2 text-sm text-primary-300">contact@nordsudaction.org</p>
          <p className="text-sm text-primary-300">+212660544904</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('footerSocial')}</p>
          <div className="mt-3 flex items-center gap-3 text-primary-300">
            <a
              className="icon-float rounded-full border border-primary-600 p-2 transition-all duration-300 hover:border-secondary-500 hover:text-secondary-500"
              href="https://www.facebook.com/nordsudaction"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.25 0-1.64.78-1.64 1.57V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
              </svg>
            </a>

            <a
              className="icon-float rounded-full border border-primary-600 p-2 transition-all duration-300 hover:border-secondary-500 hover:text-secondary-500"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm8.32 1.73a1.08 1.08 0 1 0 1.08 1.08a1.08 1.08 0 0 0-1.08-1.08ZM12 7a5 5 0 1 0 5 5a5 5 0 0 0-5-5Zm0 1.8A3.2 3.2 0 1 1 8.8 12A3.2 3.2 0 0 1 12 8.8Z" />
              </svg>
            </a>

            <a
              className="icon-float rounded-full border border-primary-600 p-2 transition-all duration-300 hover:border-secondary-500 hover:text-secondary-500"
              href="https://www.linkedin.com/company/association-nord-sud-action/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.94 8.5A1.56 1.56 0 1 1 5.38 6.94A1.56 1.56 0 0 1 6.94 8.5ZM5.5 10h2.88V19H5.5Zm4.5 0h2.76v1.23h.04a3 3 0 0 1 2.7-1.48c2.88 0 3.41 1.89 3.41 4.35V19h-2.88v-4.12c0-.98-.02-2.24-1.36-2.24s-1.57 1.06-1.57 2.17V19H10Z" />
              </svg>
            </a>
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
