import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import InputField from '../components/InputField'
import SectionContainer from '../components/SectionContainer'
import { useSubmitInscription } from '../hooks/useSubmitInscription'
import usePreventDoubleSubmit from '../hooks/usePreventDoubleSubmit'
import { fadeUp, staggerContainer } from '../utils/animations'
import { normalizeEmail, normalizePhone, validateEmail, validatePhone } from '../utils/validation'

const initialValues = {
  first_name: '',
  last_name: '',
  full_name: '',
  birth_date: '',
  city: '',
  phone: '',
  email: '',
  profession: '',
  organization: '',
  participant_profiles: [],
  participant_profile_other: '',
  investment_sectors: [],
  investment_sector_other: '',
  confirmed_activities: [],
  payment_proof: null,
  cin_copy: null,
  is_payment_confirmed: false,
  is_terms_accepted: false,
}

const INSCRIPTION_DRAFT_STORAGE_KEY = 'inscription-draft-v1'
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

const toPersistedValues = (formValues) => ({
  ...formValues,
  // File objects cannot be restored from localStorage.
  payment_proof: null,
  cin_copy: null,
})

const getDraftFromStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(INSCRIPTION_DRAFT_STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    const draftValues = {
      ...initialValues,
      ...(parsed.values || {}),
      payment_proof: null,
      cin_copy: null,
    }

    const parsedStep = Number(parsed.currentStep)
    const draftStep = Number.isFinite(parsedStep) ? parsedStep : 1

    return {
      values: draftValues,
      currentStep: Math.min(4, Math.max(1, draftStep)),
    }
  } catch {
    return null
  }
}

const clearInscriptionDraft = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(INSCRIPTION_DRAFT_STORAGE_KEY)
}

function StepBadge({ active, done, number, title }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
          done ? 'bg-accent-500 text-white' : active ? 'bg-secondary-500 text-white' : 'bg-primary-100 text-primary-500'
        }`}
      >
        {number}
      </span>
      <span className={`truncate text-sm font-semibold ${active ? 'text-primary-500' : 'text-primary-300'}`}>{title}</span>
    </div>
  )
}

function CheckboxGroup({ options, values, onToggle }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 rounded-xl border border-primary-100 bg-white px-4 py-3 text-sm font-medium text-primary-500"
        >
          <input
            type="checkbox"
            checked={values.includes(option.value)}
            onChange={() => onToggle(option.value)}
            className="h-4 w-4 rounded border-primary-300 text-secondary-500 focus:ring-secondary-500"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

function InscriptionPage() {
  const MotionDiv = motion.div
  const MotionForm = motion.form
  const { t, i18n } = useTranslation()

  const todayISO = useMemo(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }, [])

  const participantProfileOptions = useMemo(
    () => [
      { value: 'investisseur', label: t('investorLabel') },
      { value: 'entrepreneur', label: t('entrepreneurLabel') },
      { value: 'porteur_de_projet', label: t('projectCarrierLabel') },
      { value: 'chef_d_entreprise', label: t('businessChiefLabel') },
      { value: 'institutionnel', label: t('institutionalLabel') },
      { value: 'media_presse', label: t('inscriptionMediaLabel') },
      { value: 'autre', label: t('otherLabel') },
    ],
    [t]
  )

  const sectorOptions = useMemo(
    () => [
      { value: 'tourisme', label: t('tourismLabel') },
      { value: 'hotellerie_bivouacs', label: t('hotelryLabel') },
      { value: 'evenementiel', label: t('eventLabel') },
      { value: 'immobilier', label: t('realEstateLabel') },
      { value: 'artisanat', label: t('craftsLabel') },
      { value: 'commerce', label: t('commerceLabel') },
      { value: 'services', label: t('servicesLabel') },
      { value: 'autre', label: t('otherLabel') },
    ],
    [t]
  )

  const activityOptions = useMemo(
    () => [
      { value: 'conferences_networking', label: t('conferencesNetworkingLabel') },
      { value: 'excursion_desert', label: t('desertExcursionLabel') },
      { value: 'observation_astronomique', label: t('astronomicalObservationLabel') },
    ],
    [t]
  )

  const steps = useMemo(
    () => [
      { id: 1, title: t('inscriptionStep1') },
      { id: 2, title: t('inscriptionStep2') },
      { id: 3, title: t('inscriptionStep3') },
      { id: 4, title: t('inscriptionStep4') },
    ],
    [t]
  )

  const initialDraft = useMemo(() => getDraftFromStorage(), [])
  const [currentStep, setCurrentStep] = useState(() => initialDraft?.currentStep ?? 1)
  const [values, setValues] = useState(() => initialDraft?.values ?? initialValues)
  const [errors, setErrors] = useState({})
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isRibCopied, setIsRibCopied] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      INSCRIPTION_DRAFT_STORAGE_KEY,
      JSON.stringify({
        values: toPersistedValues(values),
        currentStep,
      }),
    )
  }, [values, currentStep])

  const ribCopyValue = '011530000002200000537651'
  const ribNumber = '011.530.0000.02.200.00.05376.51'
  const ribDisplayValue = `Bank Of Africa : ${ribNumber.replace(/\./g, '')}`

  const buildFullName = (firstName, lastName) => `${firstName} ${lastName}`.trim()

  const submitMutation = useSubmitInscription()
  const { wrap } = usePreventDoubleSubmit()

  const acceptTermsText = t('acceptTerms')
  const termsLinkText = t('termsOrganizationLinkText')
  const acceptTermsParts = acceptTermsText.split(termsLinkText)
  const isArabic = i18n.language === 'ar'

  const renderAmount = (value) => {
    const [amount = '', ...currencyParts] = String(value || '').trim().split(/\s+/)
    const currency = currencyParts.join(' ')

    return (
      <span dir="ltr" className="inline-flex items-baseline gap-1 whitespace-nowrap">
        <span>{amount}</span>
        <span>{currency}</span>
      </span>
    )
  }

  const progress = useMemo(() => (currentStep / steps.length) * 100, [currentStep, steps.length])

  const setField = (name, value) => {
    const nextValue = name === 'email'
      ? normalizeEmail(value)
      : name === 'phone'
        ? normalizePhone(value)
        : value

    setValues((prev) => ({ ...prev, [name]: nextValue }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleUploadChange = (name, file) => {
    setValues((prev) => ({ ...prev, [name]: file ?? null }))

    if (file && file.size > MAX_UPLOAD_BYTES) {
      setErrors((prev) => ({ ...prev, [name]: t('api.error_file_too_large') }))
      return
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleBlur = (event) => {
    const { name, value } = event.target

    if (name === 'email') {
      const result = validateEmail(value, { required: true })
      setErrors((prev) => ({ ...prev, email: result.isValid ? undefined : t(result.errorKey) }))
      return
    }

    if (name === 'phone') {
      const result = validatePhone(value, { required: true })
      setErrors((prev) => ({ ...prev, phone: result.isValid ? undefined : t(result.errorKey) }))
    }
  }

  const toggleArrayValue = (field, value) => {
    setValues((prev) => {
      const exists = prev[field].includes(value)
      return {
        ...prev,
        [field]: exists ? prev[field].filter((entry) => entry !== value) : [...prev[field], value],
      }
    })
  }

  const validateStep = (stepNumber) => {
    const nextErrors = {}

    if (stepNumber === 1) {
      if (!values.first_name.trim()) nextErrors.first_name = t('firstNameRequired')
      if (!values.last_name.trim()) nextErrors.last_name = t('lastNameRequired')
      if (!values.birth_date) nextErrors.birth_date = t('birthDateRequired')
      if (!values.city.trim()) nextErrors.city = t('cityRequired')
      const phoneResult = validatePhone(values.phone, { required: true })
      if (!phoneResult.isValid) nextErrors.phone = t(phoneResult.errorKey)
      const emailResult = validateEmail(values.email, { required: true })
      if (!emailResult.isValid) nextErrors.email = t(emailResult.errorKey)
      if (!values.profession.trim()) nextErrors.profession = t('professionRequired')
      if (!values.organization.trim()) nextErrors.organization = t('organizationRequired')
    }

    if (stepNumber === 2) {
      if (values.participant_profiles.length === 0) {
        nextErrors.participant_profiles = t('profilesRequired')
      }
      if (values.participant_profiles.includes('autre') && !values.participant_profile_other.trim()) {
        nextErrors.participant_profile_other = t('profileOtherRequired')
      }
    }

    if (stepNumber === 3) {
      if (values.investment_sectors.length === 0) {
        nextErrors.investment_sectors = t('sectorsRequired')
      }
      if (values.investment_sectors.includes('autre') && !values.investment_sector_other.trim()) {
        nextErrors.investment_sector_other = t('sectorOtherRequired')
      }
      if (values.confirmed_activities.length === 0) {
        nextErrors.confirmed_activities = t('activitiesRequired')
      }
    }

    if (stepNumber === 4) {
      if (values.payment_proof && values.payment_proof.size > MAX_UPLOAD_BYTES) {
        nextErrors.payment_proof = t('api.error_file_too_large')
      } else if (!values.payment_proof) {
        nextErrors.payment_proof = t('paymentProofRequired')
      }

      if (values.cin_copy && values.cin_copy.size > MAX_UPLOAD_BYTES) {
        nextErrors.cin_copy = t('api.error_file_too_large')
      } else if (!values.cin_copy) {
        nextErrors.cin_copy = t('cinCopyRequired')
      }
      if (!values.is_payment_confirmed) {
        nextErrors.is_payment_confirmed = t('paymentConfirmRequired')
      }
      if (!values.is_terms_accepted) {
        nextErrors.is_terms_accepted = t('termsAcceptRequired')
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    setCurrentStep((step) => Math.min(step + 1, steps.length))
  }

  const handlePrev = () => {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  const handleSubmit = wrap(async (event) => {
    event.preventDefault()

    if (!validateStep(4)) return

    await submitMutation.mutateAsync(values)
    setValues(initialValues)
    setErrors({})
    setCurrentStep(1)
    clearInscriptionDraft()
    setIsSuccessModalOpen(true)
  })

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false)
    submitMutation.reset()
  }

  const handleCopyRib = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(ribCopyValue)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = ribCopyValue
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setIsRibCopied(true)
      window.setTimeout(() => setIsRibCopied(false), 1800)
    } catch {
      setIsRibCopied(false)
    }
  }

  return (
    <SectionContainer>
      <MotionDiv
        className="mx-auto w-full max-w-5xl space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <MotionDiv variants={fadeUp} className="rounded-3xl border border-secondary-100 bg-gradient-to-r from-primary-50 via-white to-secondary-50 p-6 shadow-md">
          <p className="text-sm font-bold uppercase tracking-wide text-secondary-500">{t('inscriptionPageTitle')}</p>
          <h1 className="mt-2 text-3xl font-black text-primary-500 md:text-4xl">{t('forumSmaraInvest')}</h1>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-primary-100">
            <div className="h-full rounded-full bg-secondary-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </MotionDiv>

        <MotionDiv variants={fadeUp} className="grid gap-3 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm md:grid-cols-4">
          {steps.map((step) => (
            <StepBadge
              key={step.id}
              number={step.id}
              title={step.title}
              active={step.id === currentStep}
              done={step.id < currentStep}
            />
          ))}
        </MotionDiv>

        <MotionForm
          onSubmit={handleSubmit}
          noValidate
          variants={fadeUp}
          className="space-y-6 rounded-2xl border border-primary-100 bg-white p-6 shadow-md"
        >
          {currentStep === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label={t('formLastName')}
                name="last_name"
                required
                value={values.last_name}
                onChange={(event) => {
                  const nextLastName = event.target.value
                  const nextFullName = buildFullName(values.first_name, nextLastName)
                  setField('last_name', nextLastName)
                  setField('full_name', nextFullName)
                }}
                error={errors.last_name}
              />
              <InputField
                label={t('formFirstName')}
                name="first_name"
                required
                value={values.first_name}
                onChange={(event) => {
                  const nextFirstName = event.target.value
                  const nextFullName = buildFullName(nextFirstName, values.last_name)
                  setField('first_name', nextFirstName)
                  setField('full_name', nextFullName)
                }}
                error={errors.first_name}
              />
              <InputField
                label={t('birthDate')}
                name="birth_date"
                type="date"
                required
                max={todayISO}
                value={values.birth_date}
                onChange={(event) => setField('birth_date', event.target.value)}
                error={errors.birth_date}
              />
              <InputField
                label={t('city')}
                name="city"
                required
                value={values.city}
                onChange={(event) => setField('city', event.target.value)}
                error={errors.city}
              />
              <InputField
                label={t('phone')}
                name="phone"
                required
                value={values.phone}
                onChange={(event) => setField('phone', event.target.value)}
                onBlur={handleBlur}
                error={errors.phone}
              />
              <InputField
                label={t('email')}
                name="email"
                type="email"
                required
                value={values.email}
                onChange={(event) => setField('email', event.target.value)}
                onBlur={handleBlur}
                error={errors.email}
              />
              <InputField
                label={t('profession')}
                name="profession"
                required
                value={values.profession}
                onChange={(event) => setField('profession', event.target.value)}
                error={errors.profession}
              />
              <InputField
                label={t('organization')}
                name="organization"
                required
                value={values.organization}
                onChange={(event) => setField('organization', event.target.value)}
                error={errors.organization}
              />
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-primary-500">{t('youAre')}</h2>
              <CheckboxGroup
                options={participantProfileOptions}
                values={values.participant_profiles}
                onToggle={(value) => toggleArrayValue('participant_profiles', value)}
              />
              {errors.participant_profiles ? (
                <p className="text-sm font-medium text-secondary-600">{errors.participant_profiles}</p>
              ) : null}

              {values.participant_profiles.includes('autre') ? (
                <InputField
                  label={t('otherProfile')}
                  name="participant_profile_other"
                  required
                  value={values.participant_profile_other}
                  onChange={(event) => setField('participant_profile_other', event.target.value)}
                  error={errors.participant_profile_other}
                />
              ) : null}
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-black text-primary-500">{t('investmentInterests')}</h2>
                <CheckboxGroup
                  options={sectorOptions}
                  values={values.investment_sectors}
                  onToggle={(value) => toggleArrayValue('investment_sectors', value)}
                />
                {errors.investment_sectors ? (
                  <p className="text-sm font-medium text-secondary-600">{errors.investment_sectors}</p>
                ) : null}
                {values.investment_sectors.includes('autre') ? (
                  <InputField
                    label={t('otherSector')}
                    name="investment_sector_other"
                    required
                    value={values.investment_sector_other}
                    onChange={(event) => setField('investment_sector_other', event.target.value)}
                    error={errors.investment_sector_other}
                  />
                ) : null}
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-black text-primary-500">{t('confirmedActivities')}</h2>
                <CheckboxGroup
                  options={activityOptions}
                  values={values.confirmed_activities}
                  onToggle={(value) => toggleArrayValue('confirmed_activities', value)}
                />
                {errors.confirmed_activities ? (
                  <p className="text-sm font-medium text-secondary-600">{errors.confirmed_activities}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-secondary-100 bg-secondary-50/50 p-5 text-sm text-primary-500">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="text-base font-black text-primary-500">{t('financialParticipation')}</h2>
                  <p className="font-bold text-secondary-600">
                    {isArabic ? (
                      <>
                        <span dir="ltr">: </span>
                        {renderAmount(t('rate').replace(/^:\s*/, ''))}
                      </>
                    ) : (
                      <bdi dir="ltr">{t('rate')}</bdi>
                    )}
                  </p>
                </div>
                <p className="mt-3 font-semibold text-primary-500">{t('includesLabel')}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-primary-400">
                  <li>{t('roundTripFlightCasablanca')}</li>
                  <li>{t('accommodation')}</li>
                  <li>{t('meals')}</li>
                  <li>{t('localTransport')}</li>
                  <li>{t('conferenceAccess')}</li>
                  <li>{t('activitiesAndDesertExcursion')}</li>
                </ul>

                <div className="mt-4 rounded-xl border border-primary-200 bg-white/80 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-primary-600">RIB : {ribDisplayValue}</p>
                    <button
                      type="button"
                      onClick={handleCopyRib}
                      className="inline-flex items-center gap-2 rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-600 transition hover:border-secondary-300 hover:text-secondary-600"
                      aria-label={t('copyRib')}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                        <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {isRibCopied ? t('copied') : t('copyRib')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 text-sm text-primary-500">
                  <label htmlFor="payment_proof" className="block font-semibold text-primary-500">
                    {t('paymentProofLabel')}
                  </label>
                  <p className="mt-1 text-xs text-primary-400">{t('paymentProofHint')}</p>
                  <input
                    id="payment_proof"
                    name="payment_proof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={(event) => handleUploadChange('payment_proof', event.target.files?.[0] ?? null)}
                    className="mt-3 block w-full cursor-pointer rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-primary-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-200"
                  />
                  {errors.payment_proof ? (
                    <p className="mt-2 text-sm font-medium text-secondary-600">{errors.payment_proof}</p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 text-sm text-primary-500">
                  <label htmlFor="cin_copy" className="block font-semibold text-primary-500">
                    {t('cinCopyLabel')}
                  </label>
                  <p className="mt-1 text-xs text-primary-400">{t('cinCopyHint')}</p>
                  <input
                    id="cin_copy"
                    name="cin_copy"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(event) => handleUploadChange('cin_copy', event.target.files?.[0] ?? null)}
                    className="mt-3 block w-full cursor-pointer rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-primary-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-200"
                  />
                  {errors.cin_copy ? (
                    <p className="mt-2 text-sm font-medium text-secondary-600">{errors.cin_copy}</p>
                  ) : null}
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-500">
                <input
                  type="checkbox"
                  checked={values.is_payment_confirmed}
                  onChange={(event) => setField('is_payment_confirmed', event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-primary-300 text-secondary-500 focus:ring-secondary-500"
                />
                <span>
                  {t('paymentConfirmLabelPre')}
                  <strong className="font-black text-primary-600">
                    {isArabic ? renderAmount(t('paymentConfirmAmount')) : <bdi dir="ltr">{t('paymentConfirmAmount')}</bdi>}
                  </strong>
                  {t('paymentConfirmLabelMid')}
                  <strong className="font-black text-primary-600">{t('paymentConfirmAssoc')}</strong>{' \u2013 '}
                  <strong className="font-black text-primary-600">{t('paymentConfirmBank')}</strong>{' RIB\u00a0: '}
                  <strong className="font-black text-primary-600"><bdi dir="ltr">{t('paymentConfirmRib')}</bdi></strong>
                </span>
              </label>
              {errors.is_payment_confirmed ? (
                <p className="text-sm font-medium text-secondary-600">{errors.is_payment_confirmed}</p>
              ) : null}

              <label className="flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-500">
                <input
                  type="checkbox"
                  checked={values.is_terms_accepted}
                  onChange={(event) => setField('is_terms_accepted', event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-primary-300 text-secondary-500 focus:ring-secondary-500"
                />
                <span>
                  {acceptTermsParts.length === 2 ? (
                    <>
                      {acceptTermsParts[0]}
                      <a
                        href="/conditions-participation"
                        className="font-semibold underline decoration-primary-400 underline-offset-2 hover:text-secondary-600"
                        onClick={(event) => event.stopPropagation()}
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        {termsLinkText}
                      </a>
                      {acceptTermsParts[1]}
                    </>
                  ) : (
                    <a
                      href="/conditions-participation"
                      className="font-semibold underline decoration-primary-400 underline-offset-2 hover:text-secondary-600"
                      onClick={(event) => event.stopPropagation()}
                      onMouseDown={(event) => event.stopPropagation()}
                    >
                      {acceptTermsText}
                    </a>
                  )}
                </span>
              </label>
              {errors.is_terms_accepted ? (
                <p className="text-sm font-medium text-secondary-600">{errors.is_terms_accepted}</p>
              ) : null}
            </div>
          ) : null}

          {submitMutation.isError ? (

            <ErrorState error={submitMutation.error} />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary-100 pt-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('back')}
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-secondary-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600"
              >
                {t('nextStep')}
              </button>
            ) : (
              <Button type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? t('sending') : t('validateInscription')}
              </Button>
            )}
          </div>
        </MotionForm>
      </MotionDiv>

      {isSuccessModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="inscription-success-title">
          <div className="w-full max-w-md rounded-2xl border border-primary-100 bg-white p-6 shadow-2xl">
            <h3 id="inscription-success-title" className="text-xl font-black text-primary-500">
              {t('inscriptionSuccessTitle')}
            </h3>
            <p className="mt-3 text-sm leading-6 text-primary-400">
              {t('inscriptionSuccessMessage1')}
            </p>
            <p className="mt-2 text-sm leading-6 text-primary-400">
              {t('inscriptionSuccessMessage2')}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeSuccessModal}
                className="rounded-xl bg-secondary-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SectionContainer>
  )
}

export default InscriptionPage
