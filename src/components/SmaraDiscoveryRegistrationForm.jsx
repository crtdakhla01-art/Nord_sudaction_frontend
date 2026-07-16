import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import InputField from '../components/InputField'
import { useSubmitSmaraDiscoveryRegistration } from '../hooks/useSubmitSmaraDiscoveryRegistration'
import usePreventDoubleSubmit from '../hooks/usePreventDoubleSubmit'
import { fadeUp } from '../utils/animations'
import { normalizeEmail, normalizePhone, validateEmail, validatePhone } from '../utils/validation'

const ACTIVITY_OPTIONS = [
  { value: 'astrotourism', labelKey: 'smaraDiscoveryActivityAstrotourism' },
  { value: 'bivouac', labelKey: 'smaraDiscoveryActivityBivouac' },
  { value: 'hiking', labelKey: 'smaraDiscoveryActivityHiking' },
  { value: 'archaeological_sites', labelKey: 'smaraDiscoveryActivityArchaeology' },
  { value: 'hassani_culture', labelKey: 'smaraDiscoveryActivityHassani' },
  { value: 'wildlife_observation', labelKey: 'smaraDiscoveryActivityWildlife' },
  { value: 'photography', labelKey: 'smaraDiscoveryActivityPhotography' },
]

const initialForm = {
  full_name: '',
  city: '',
  phone: '',
  email: '',
  age_group: '',
  has_visited_es_smara: '',
  interest_level: '',
  participants_count: '',
  preferred_duration: '',
  departure_city: '',
  budget: '',
  preferred_activities: [],
  notify_first_date: '',
}

const fieldClass =
  'mt-2 block w-full rounded-xl border border-secondary-100 bg-white px-4 py-3 text-sm text-primary-500 shadow-sm outline-none transition focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20'

function RadioGroup({ legend, name, value, onChange, options, error }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-primary-500 rtl:text-right">
        {legend}
        <span className="ml-0.5 text-red-500 rtl:mr-0.5 rtl:ml-0">*</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition rtl:flex-row-reverse rtl:text-right ${
              value === option.value
                ? 'border-secondary-400 bg-secondary-50 text-primary-600'
                : 'border-primary-100 bg-white text-primary-500 hover:border-secondary-200'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 accent-secondary-500"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? <p className="text-xs text-secondary-600">{error}</p> : null}
    </fieldset>
  )
}

export default function SmaraDiscoveryRegistrationForm() {
  const MotionForm = motion.form
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const submitMutation = useSubmitSmaraDiscoveryRegistration()
  const { wrap } = usePreventDoubleSubmit()

  useEffect(() => {
    if (!isSuccessModalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const redirectTimer = window.setTimeout(() => navigate('/'), 3000)

    return () => {
      window.clearTimeout(redirectTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [isSuccessModalOpen, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextValue =
      name === 'email' ? normalizeEmail(value) : name === 'phone' ? normalizePhone(value) : value

    setFormValues((prev) => ({ ...prev, [name]: nextValue }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const toggleActivity = (activity) => {
    setFormValues((prev) => {
      const exists = prev.preferred_activities.includes(activity)
      const preferred_activities = exists
        ? prev.preferred_activities.filter((item) => item !== activity)
        : [...prev.preferred_activities, activity]

      return { ...prev, preferred_activities }
    })
    setFormErrors((prev) => ({ ...prev, preferred_activities: undefined }))
  }

  const validate = () => {
    const errors = {}

    if (!formValues.full_name.trim()) errors.full_name = t('fullNameRequired')
    if (!formValues.city.trim()) errors.city = t('cityRequired')

    const emailResult = validateEmail(formValues.email, { required: true })
    if (!emailResult.isValid) errors.email = t(emailResult.errorKey)

    const phoneResult = validatePhone(formValues.phone, { required: true })
    if (!phoneResult.isValid) errors.phone = t(phoneResult.errorKey)

    if (!formValues.age_group) errors.age_group = t('requiredError')
    if (!formValues.has_visited_es_smara) errors.has_visited_es_smara = t('requiredError')
    if (!formValues.interest_level) errors.interest_level = t('requiredError')
    if (!formValues.participants_count) errors.participants_count = t('requiredError')
    if (!formValues.preferred_duration) errors.preferred_duration = t('requiredError')
    if (!formValues.departure_city.trim()) errors.departure_city = t('requiredError')
    if (!formValues.budget.trim()) errors.budget = t('requiredError')
    if (!formValues.preferred_activities.length) errors.preferred_activities = t('smaraDiscoveryActivitiesRequired')
    if (!formValues.notify_first_date) errors.notify_first_date = t('requiredError')

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = wrap(async (event) => {
    event.preventDefault()
    if (!validate()) return

    await submitMutation.mutateAsync(formValues)
    setFormValues(initialForm)
    setFormErrors({})
    setIsSuccessModalOpen(true)
  })

  const yesNoOptions = [
    { value: 'yes', label: t('smaraDiscoveryYes') },
    { value: 'no', label: t('smaraDiscoveryNo') },
  ]

  return (
    <>
      <MotionForm
      id="smara-discovery-registration"
      className="space-y-6 rounded-3xl border border-secondary-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm md:p-10"
      onSubmit={handleSubmit}
      noValidate
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label={t('smaraDiscoveryFullName')}
          name="full_name"
          required
          value={formValues.full_name}
          onChange={handleChange}
          error={formErrors.full_name}
        />
        <InputField
          label={t('smaraDiscoveryResidenceCity')}
          name="city"
          required
          value={formValues.city}
          onChange={handleChange}
          error={formErrors.city}
        />
        <InputField
          label={t('smaraDiscoveryPhone')}
          name="phone"
          type="tel"
          dir="ltr"
          inputMode="tel"
          required
          value={formValues.phone}
          onChange={handleChange}
          error={formErrors.phone}
        />
        <InputField
          label={t('smaraDiscoveryEmail')}
          name="email"
          type="email"
          dir="ltr"
          inputMode="email"
          required
          value={formValues.email}
          onChange={handleChange}
          error={formErrors.email}
        />
      </div>

      <label className="block text-sm font-medium text-primary-500 rtl:text-right">
        <span>
          {t('smaraDiscoveryAgeGroup')}
          <span className="ml-0.5 text-red-500 rtl:mr-0.5 rtl:ml-0">*</span>
        </span>
        <select
          name="age_group"
          value={formValues.age_group}
          onChange={handleChange}
          className={`${fieldClass} rtl:text-right`}
        >
          <option value="">{t('smaraDiscoverySelectOption')}</option>
          <option value="under_25">{t('smaraDiscoveryAgeUnder25')}</option>
          <option value="25_34">{t('smaraDiscoveryAge25_34')}</option>
          <option value="35_44">{t('smaraDiscoveryAge35_44')}</option>
          <option value="45_54">{t('smaraDiscoveryAge45_54')}</option>
          <option value="55_plus">{t('smaraDiscoveryAge55Plus')}</option>
        </select>
        {formErrors.age_group ? <span className="mt-1 block text-xs text-secondary-600">{formErrors.age_group}</span> : null}
      </label>

      <div className="grid gap-5 lg:grid-cols-2">
        <RadioGroup
          legend={t('smaraDiscoveryVisited')}
          name="has_visited_es_smara"
          value={formValues.has_visited_es_smara}
          onChange={handleChange}
          options={yesNoOptions}
          error={formErrors.has_visited_es_smara}
        />
        <RadioGroup
          legend={t('smaraDiscoveryNotify')}
          name="notify_first_date"
          value={formValues.notify_first_date}
          onChange={handleChange}
          options={yesNoOptions}
          error={formErrors.notify_first_date}
        />
      </div>

      <RadioGroup
        legend={t('smaraDiscoveryInterest')}
        name="interest_level"
        value={formValues.interest_level}
        onChange={handleChange}
        options={[
          { value: 'certainly', label: t('smaraDiscoveryInterestCertainly') },
          { value: 'probably', label: t('smaraDiscoveryInterestProbably') },
          { value: 'maybe', label: t('smaraDiscoveryInterestMaybe') },
        ]}
        error={formErrors.interest_level}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <RadioGroup
          legend={t('smaraDiscoveryParticipants')}
          name="participants_count"
          value={formValues.participants_count}
          onChange={handleChange}
          options={[
            { value: '1', label: t('smaraDiscoveryParticipants1') },
            { value: '2', label: t('smaraDiscoveryParticipants2') },
            { value: '3_or_more', label: t('smaraDiscoveryParticipants3Plus') },
          ]}
          error={formErrors.participants_count}
        />
        <RadioGroup
          legend={t('smaraDiscoveryDuration')}
          name="preferred_duration"
          value={formValues.preferred_duration}
          onChange={handleChange}
          options={[
            { value: 'weekend', label: t('smaraDiscoveryDurationWeekend') },
            { value: '3_days', label: t('smaraDiscoveryDuration3Days') },
            { value: '4_days_plus', label: t('smaraDiscoveryDuration4Plus') },
          ]}
          error={formErrors.preferred_duration}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label={t('smaraDiscoveryDepartureCity')}
          name="departure_city"
          required
          value={formValues.departure_city}
          onChange={handleChange}
          error={formErrors.departure_city}
        />
        <InputField
          label={t('smaraDiscoveryBudget')}
          name="budget"
          required
          value={formValues.budget}
          onChange={handleChange}
          error={formErrors.budget}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-primary-500 rtl:text-right">
          {t('smaraDiscoveryActivitiesField')}
          <span className="ml-0.5 text-red-500 rtl:mr-0.5 rtl:ml-0">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACTIVITY_OPTIONS.map((activity) => {
            const checked = formValues.preferred_activities.includes(activity.value)

            return (
              <label
                key={activity.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition rtl:flex-row-reverse rtl:text-right ${
                  checked
                    ? 'border-secondary-400 bg-secondary-50 text-primary-600'
                    : 'border-primary-100 bg-white text-primary-500 hover:border-secondary-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleActivity(activity.value)}
                  className="h-4 w-4 rounded accent-secondary-500"
                />
                {t(activity.labelKey)}
              </label>
            )
          })}
        </div>
        {formErrors.preferred_activities ? (
          <p className="text-xs text-secondary-600">{formErrors.preferred_activities}</p>
        ) : null}
      </fieldset>

      {submitMutation.isError ? <ErrorState error={submitMutation.error} /> : null}

      <div className="flex justify-end rtl:justify-start">
        <Button type="submit" disabled={submitMutation.isPending} className="min-w-[180px]">
          {submitMutation.isPending ? t('smaraDiscoverySubmitting') : t('smaraDiscoverySubmit')}
        </Button>
      </div>
      </MotionForm>

      <AnimatePresence>
        {isSuccessModalOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="smara-discovery-success-title"
            aria-describedby="smara-discovery-success-message"
          >
            <motion.div
              className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-7 text-center shadow-2xl sm:p-9"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              dir="auto"
            >
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-5xl font-bold text-emerald-600 shadow-inner"
                aria-hidden="true"
              >
                ✓
              </div>
              <h2
                id="smara-discovery-success-title"
                className="mt-6 text-2xl font-black text-primary-600"
              >
                {t('smaraDiscoverySuccessTitle')}
              </h2>
              <p
                id="smara-discovery-success-message"
                className="mt-3 text-base leading-7 text-primary-400"
              >
                {t('smaraDiscoverySuccessMessage')}
              </p>
              <Button type="button" className="mt-7 min-w-32" onClick={() => navigate('/')}>
                {t('smaraDiscoverySuccessOk')}
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
