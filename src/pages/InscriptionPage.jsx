import { useMemo, useState } from 'react'
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
  is_terms_accepted: false,
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
  const { t } = useTranslation()

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
      { value: 'soiree_bivouac', label: t('bivouacEveningLabel') },
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

  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const submitMutation = useSubmitInscription()
  const { wrap } = usePreventDoubleSubmit()

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
      if (!values.full_name.trim()) nextErrors.full_name = t('fullNameRequired')
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
    setIsSuccessModalOpen(true)
  })

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false)
    submitMutation.reset()
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
                label={t('fullName')}
                name="full_name"
                required
                value={values.full_name}
                onChange={(event) => setField('full_name', event.target.value)}
                error={errors.full_name}
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
              <div className="md:col-span-2">
                <InputField
                  label={t('organization')}
                  name="organization"
                  required
                  value={values.organization}
                  onChange={(event) => setField('organization', event.target.value)}
                  error={errors.organization}
                />
              </div>
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
                <h2 className="text-base font-black text-primary-500">{t('financialParticipation')}</h2>
                <p className="mt-2 font-bold text-secondary-600">{t('rate')}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-primary-400">
                  <li>{t('roundTripFlightCasablanca')}</li>
                  <li>{t('accommodation')}</li>
                  <li>{t('meals')}</li>
                  <li>{t('localTransport')}</li>
                  <li>{t('conferenceAccess')}</li>
                  <li>{t('activitiesAndDesertExcursion')}</li>
                </ul>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-500">
                <input
                  type="checkbox"
                  checked={values.is_terms_accepted}
                  onChange={(event) => setField('is_terms_accepted', event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-primary-300 text-secondary-500 focus:ring-secondary-500"
                />
                <span>{t('acceptTerms')}</span>
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
