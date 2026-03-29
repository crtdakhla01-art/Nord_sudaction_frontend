import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import InputField from '../components/InputField'
import SectionContainer from '../components/SectionContainer'
import TextareaField from '../components/TextareaField'
import { useSubmitContactMessage } from '../hooks/useSubmitContactMessage'

const initialForm = {
  name: '',
  email: '',
  message: '',
}

function ContactPage() {
  const { t } = useTranslation()
  const [formValues, setFormValues] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const submitMutation = useSubmitContactMessage()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const errors = {}
    if (!formValues.name) errors.name = t('requiredError')
    if (!formValues.email) {
      errors.email = t('requiredError')
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      errors.email = t('invalidEmailError')
    }
    if (!formValues.message) errors.message = t('requiredError')

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    await submitMutation.mutateAsync(formValues)
    setFormValues(initialForm)
    setFormErrors({})
  }

  return (
    <SectionContainer>
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold text-primary-500 md:text-5xl">{t('contactTitle')}</h1>
          <p className="mt-4 text-base leading-7 text-primary-400">{t('contactIntro')}</p>

          <div className="mt-6 space-y-4 rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-primary-500">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                @
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-300">{t('emailLabel')}</p>
                <p className="text-sm font-medium text-primary-500">contact@nordsudaction.org</p>
              </div>
            </div>
            <a
              href="https://wa.me/212660544904"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-white/60" />
              {t('whatsappLabel')} +212 660 544 904
            </a>
          </div>
        </div>

        <form
          className="space-y-5 rounded-2xl border border-primary-100 bg-white p-6 shadow-md"
          onSubmit={handleSubmit}
          noValidate
        >
          <InputField
            label={t('formName')}
            name="name"
            value={formValues.name}
            onChange={handleChange}
            error={formErrors.name}
          />

          <InputField
            label={t('formEmail')}
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            error={formErrors.email}
          />

          <TextareaField
            label={t('formMessage')}
            name="message"
            rows={6}
            value={formValues.message}
            onChange={handleChange}
            error={formErrors.message}
          />

          {submitMutation.isError ? (
            <ErrorState message={submitMutation.error?.response?.data?.message || submitMutation.error?.message} />
          ) : null}
          {submitMutation.isSuccess ? (
            <p className="rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-700">
              {t('contactSuccess')}
            </p>
          ) : null}

          <Button type="submit" disabled={submitMutation.isPending}>
            {submitMutation.isPending ? t('sending') : t('submit')}
          </Button>
        </form>
      </div>
    </SectionContainer>
  )
}

export default ContactPage
