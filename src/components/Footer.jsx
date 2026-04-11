import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from '../assets/blanc_logo.png'
import { useSubscribeNewsletter } from '../hooks/useSubscribeNewsletter'

const contactPhone = '+212660544904'

const initialNewsletterForm = {
  name: '',
  email: '',
  consent: false,
}

function Footer() {
  const { t } = useTranslation()
  const subscribeMutation = useSubscribeNewsletter()
  const [newsletterForm, setNewsletterForm] = useState(initialNewsletterForm)
  const [newsletterErrors, setNewsletterErrors] = useState({})

  const handleNewsletterChange = (event) => {
    const { name, type, value, checked } = event.target
    setNewsletterForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setNewsletterErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validateNewsletterForm = () => {
    const nextErrors = {}

    if (!newsletterForm.name.trim()) {
      nextErrors.name = t('requiredError')
    }

    if (!newsletterForm.email.trim()) {
      nextErrors.email = t('requiredError')
    } else if (!/^\S+@\S+\.\S+$/.test(newsletterForm.email.trim())) {
      nextErrors.email = t('invalidEmailError')
    }

    if (!newsletterForm.consent) {
      nextErrors.consent = t('requiredError')
    }

    setNewsletterErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const getNewsletterErrorMessage = () => {
    const response = subscribeMutation.error?.response
    const emailErrors = response?.data?.errors?.email
    const validationMessage = response?.data?.message
    const exceptionName = response?.data?.exception
    const normalizedMessage = String(validationMessage || '').toLowerCase()
    const isDuplicateEmailMessage = normalizedMessage.includes('already used')
      || normalizedMessage.includes('already been taken')
      || normalizedMessage.includes('deja utilise')
      || normalizedMessage.includes('déjà utilisé')
    const hasEmailValidationError = Array.isArray(emailErrors) && emailErrors.length > 0
    const isValidationException = response?.status === 422
      || String(exceptionName || '').includes('ValidationException')

    if (isDuplicateEmailMessage) {
      return t('newsletterAlreadySubscribed')
    }

    if (isValidationException && typeof validationMessage === 'string' && validationMessage.trim()) {
      return validationMessage
    }

    if (hasEmailValidationError && typeof emailErrors[0] === 'string' && emailErrors[0].trim()) {
      return emailErrors[0]
    }

    if (hasEmailValidationError) return t('newsletterAlreadySubscribed')
    return t('newsletterError')
  }

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    if (!validateNewsletterForm()) return

    await subscribeMutation.mutateAsync({
      name: newsletterForm.name.trim(),
      email: newsletterForm.email.trim(),
      consent: newsletterForm.consent,
    })

    setNewsletterForm(initialNewsletterForm)
    setNewsletterErrors({})
  }

  return (
    <footer className="mt-8 bg-primary-800 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo} alt="Nord Sud Action" className="h-14 w-auto rounded-lg" loading="lazy" decoding="async" />
          <p className="mt-2 max-w-sm text-sm leading-6 text-primary-300">{t('footerText')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('footerPages')}</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link to="/" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navHome')}</Link>
            <Link to="/opportunities" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navOpportunities')}</Link>
            <Link to="/events" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navEvents')}</Link>
            <Link to="/galerie" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navGallery')}</Link>
            <Link to="/activities" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navActivites')}</Link>
            <Link to="/contact" className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500">{t('navContact')}</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('footerContact')}</p>
          <p className="mt-2 text-sm text-primary-300">contact@nordsudaction.org</p>
          <p className="text-sm text-primary-300">
            <span dir="ltr">{contactPhone}</span>
          </p>

          <div className="mt-4">
            <p className="text-sm font-semibold text-white">{t('footerNewsletterTitle')}</p>
            <p className="mt-1 text-xs text-primary-300">{t('footerNewsletterDescription')}</p>

            <form className="mt-3 space-y-2" onSubmit={handleNewsletterSubmit} noValidate>
              <label className="sr-only" htmlFor="newsletter-name">{t('formName')}</label>
              <input
                id="newsletter-name"
                name="name"
                type="text"
                value={newsletterForm.name}
                onChange={handleNewsletterChange}
                placeholder={t('footerNewsletterNamePlaceholder')}
                className="w-full rounded-lg border border-secondary-700 bg-primary-900 px-3 py-2 text-sm text-white placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none"
              />
              {newsletterErrors.name ? <p className="text-xs text-red-300">{newsletterErrors.name}</p> : null}

              <label className="sr-only" htmlFor="newsletter-email">{t('formEmail')}</label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                value={newsletterForm.email}
                onChange={handleNewsletterChange}
                placeholder={t('footerNewsletterEmailPlaceholder')}
                className="w-full rounded-lg border border-secondary-700 bg-primary-900 px-3 py-2 text-sm text-white placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none"
              />
              {newsletterErrors.email ? <p className="text-xs text-red-300">{newsletterErrors.email}</p> : null}

              <label className="mt-1 flex items-start gap-2 text-xs text-primary-200" htmlFor="newsletter-consent">
                <input
                  id="newsletter-consent"
                  name="consent"
                  type="checkbox"
                  checked={newsletterForm.consent}
                  onChange={handleNewsletterChange}
                  className="mt-0.5 h-4 w-4 rounded border-secondary-600 bg-primary-900 text-secondary-500 focus:ring-secondary-500"
                />
                <span>{t('footerNewsletterConsentLabel')}</span>
              </label>
              {newsletterErrors.consent ? <p className="text-xs text-red-300">{newsletterErrors.consent}</p> : null}

              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-secondary-500 px-3 py-2 text-sm font-semibold text-primary-900 transition hover:bg-secondary-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {subscribeMutation.isPending ? t('sending') : t('footerNewsletterButton')}
              </button>
            </form>

            {subscribeMutation.isSuccess ? (
              <p className="mt-2 text-xs text-green-300">{t('newsletterSuccess')}</p>
            ) : null}
            {subscribeMutation.isError ? (
              <p className="mt-2 text-xs text-red-300">{getNewsletterErrorMessage()}</p>
            ) : null}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('footerSocial')}</p>
          <div className="mt-3 flex items-center gap-3 text-primary-300">
            <a
              className="icon-float rounded-full border border-secondary-600 p-2 transition-all duration-300 hover:border-secondary-500 hover:text-secondary-500"
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
              className="icon-float rounded-full border border-secondary-600 p-2 transition-all duration-300 hover:border-secondary-500 hover:text-secondary-500"
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
              className="icon-float rounded-full border border-secondary-600 p-2 transition-all duration-300 hover:border-secondary-500 hover:text-secondary-500"
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

          <div className="mt-6">
            <p className="text-sm font-semibold text-white">{t('footerUsefulLinks')}</p>
            <div className="mt-2 flex flex-col gap-2">
              <a
                href="https://www.visitmorocco.com"
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500"
              >
                www.visitmorocco.com
              </a>
              <a
                href="https://www.dakhlainvest.ma"
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500"
              >
                www.dakhlainvest.ma
              </a>
              <a
                href="https://www.justice.gov.ma"
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500"
              >
                www.justice.gov.ma
              </a>
              <a
                href="https://www.diplomatie.ma"
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500"
              >
                www.diplomatie.ma
              </a>
                            <a
                href="https://www.visitdakhla.ma"
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-primary-300 transition-colors duration-300 hover:text-secondary-500"
              >
                www.visitdakhla.ma
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary-700 px-4 py-4 text-center text-xs leading-5 text-primary-400 sm:px-6">
        &copy; {new Date().getFullYear()} Nord Sud Action. {t('footerCopyright')}
      </div>
    </footer>
  )
}

export default Footer
