import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import InputField from '../components/InputField'
import LoadingState from '../components/LoadingState'
import OpportunityCard from '../components/OpportunityCard'
import SectionContainer from '../components/SectionContainer'
import TextareaField from '../components/TextareaField'
import { useOpportunityTypes } from '../hooks/useOpportunityTypes'
import { useOpportunities } from '../hooks/useOpportunities'
import { useSubmitOpportunity } from '../hooks/useSubmitOpportunity'
import { fadeLeft, fadeUp, inViewViewport, staggerContainer } from '../utils/animations'

const initialForm = {
  titre: '',
  ville: '',
  first_name: '',
  last_name: '',
  description: '',
  budget: '',
  phone: '',
  email: '',
  type_key: '',
  images: [],
}

function OpportunitiesPage() {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1
  const MotionForm = motion.form

  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('list')
  const [selectedTypeId, setSelectedTypeId] = useState('all')
  const [page, setPage] = useState(1)
  const [formValues, setFormValues] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const itemsPerPage = 16

  const { data: opportunities, isLoading, isError, error } = useOpportunities()
  const { data: opportunityTypes } = useOpportunityTypes()
  const submitMutation = useSubmitOpportunity()

  const staticTypeOptions = [
    { key: 'investment', label: t('opportunityTypeInvestment') },
    { key: 'commerce', label: t('opportunityTypeCommerce') },
    { key: 'partnership', label: t('opportunityTypePartnership') },
    { key: 'calls', label: t('opportunityTypeCalls') },
    { key: 'other', label: t('opportunityTypeOther') },
  ]

  const normalizeTypeName = (value = '') =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()

  const getTypeDisplayName = (name = '') =>
    normalizeTypeName(name) === 'autre' ? t('opportunityTypeOther') : name

  const hasOtherTypeFromBackend = (opportunityTypes || []).some(
    (type) => normalizeTypeName(type?.name) === 'autre',
  )

  const sortedOpportunityTypes = [...(opportunityTypes || [])].sort((a, b) => {
    const aIsOther = normalizeTypeName(a?.name) === 'autre'
    const bIsOther = normalizeTypeName(b?.name) === 'autre'

    if (aIsOther && !bIsOther) {
      return 1
    }

    if (!aIsOther && bIsOther) {
      return -1
    }

    return 0
  })

  const filteredOpportunities = (opportunities || []).filter((opportunity) => {
    if (selectedTypeId === 'all') {
      return true
    }

    if (selectedTypeId === 'other') {
      return normalizeTypeName(opportunity?.type?.name || '') === 'autre'
    }

    return String(opportunity.type_id) === selectedTypeId
  })

  const totalItems = filteredOpportunities.length
  const shouldPaginate = totalItems > itemsPerPage
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const paginatedOpportunities = filteredOpportunities.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const MAX_IMAGE_SIZE_MB = 20
  const MAX_IMAGE_COUNT = 10

  const validate = () => {
    const errors = {}
    const requiredFields = ['titre', 'ville', 'first_name', 'last_name', 'description', 'email', 'type_key']

    requiredFields.forEach((field) => {
      if (!formValues[field]) {
        errors[field] = t('requiredError')
      }
    })

    if (formValues.email && !/^\S+@\S+\.\S+$/.test(formValues.email)) {
      errors.email = t('invalidEmailError')
    }

    if (formValues.images.length > MAX_IMAGE_COUNT) {
      errors.images = t('imageCountError')
    } else {
      const oversized = formValues.images.find((f) => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
      if (oversized) {
        errors.images = t('imageSizeError', { name: oversized.name })
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const getFriendlyServerError = (error) => {
    const data = error?.response?.data
    if (!data) return t('formSubmitError')
    const { errors } = data
    if (errors && typeof errors === 'object') {
      const messages = Object.entries(errors).flatMap(([field, msgs]) => {
        const raw = Array.isArray(msgs) ? msgs[0] : msgs
        if (field === 'images' || field.startsWith('images.')) {
          if (/size|kilobytes|megabytes|taille/i.test(raw)) return [t('imageGenericError')]
          if (/count|max|nombre/i.test(raw)) return [t('imageCountError')]
          return [t('imageGenericError')]
        }
        return [raw]
      })
      const unique = [...new Set(messages)]
      return unique.join(' ')
    }
    return data.message || t('formSubmitError')
  }

  const handleChange = (event) => {
    const { name, value, files } = event.target

    if (name === 'images') {
      const incomingFiles = Array.from(files || [])

      setFormValues((prev) => {
        const mergedFiles = [...prev.images, ...incomingFiles]
        const dedupedFiles = mergedFiles.filter((file, index, list) => {
          return index === list.findIndex((item) => (
            item.name === file.name && item.size === file.size && item.lastModified === file.lastModified
          ))
        })

        return {
          ...prev,
          images: dedupedFiles,
        }
      })

      return
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const removeSelectedImage = (targetIndex) => {
    setFormValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== targetIndex),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) return

    try {
      await submitMutation.mutateAsync(formValues)
      setFormValues(initialForm)
      setFormErrors({})
    } catch {
      // error is displayed via submitMutation.isError
    }
  }

  const tabClass = (tab) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
      activeTab === tab
        ? 'bg-secondary-500 text-white shadow'
        : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500'
    }`

  return (
    <SectionContainer>
      <MotionDiv
        className="mx-auto w-full max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <MotionH1 className="text-4xl font-extrabold text-primary-500 md:text-5xl" variants={fadeLeft}>{t('opportunitiesPageTitle')}</MotionH1>

        <MotionDiv className="mt-6 inline-flex items-center gap-1 rounded-xl border border-primary-100 bg-white p-1 shadow-sm" variants={fadeUp}>
          <button type="button" className={tabClass('list')} onClick={() => setActiveTab('list')}>
            {t('opportunitiesViewTab')}
          </button>
          <button type="button" className={tabClass('submit')} onClick={() => setActiveTab('submit')}>
            {t('opportunitiesSubmitTab')}
          </button>
        </MotionDiv>

        {activeTab === 'list' ? (
          <MotionDiv className="mt-7" variants={fadeUp}>
            {isLoading ? <LoadingState /> : null}
            {isError ? <ErrorState message={error?.message} /> : null}
            {!isLoading && !isError ? (
              <>
                <MotionDiv className="mb-6 flex flex-wrap gap-2" variants={fadeUp}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTypeId('all')
                      setPage(1)
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      selectedTypeId === 'all'
                        ? 'bg-secondary-500 text-white shadow'
                        : 'border border-primary-200 bg-white text-primary-500 hover:border-secondary-300 hover:text-secondary-500'
                    }`}
                  >
                    {t('filterAllTypes')}
                  </button>

                  {sortedOpportunityTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setSelectedTypeId(String(type.id))
                        setPage(1)
                      }}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        selectedTypeId === String(type.id)
                          ? 'bg-secondary-500 text-white shadow'
                          : 'border border-primary-200 bg-white text-primary-500 hover:border-secondary-300 hover:text-secondary-500'
                      }`}
                    >
                      {getTypeDisplayName(type.name)}
                    </button>
                  ))}

                  {!hasOtherTypeFromBackend ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTypeId('other')
                        setPage(1)
                      }}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        selectedTypeId === 'other'
                          ? 'bg-secondary-500 text-white shadow'
                          : 'border border-primary-200 bg-white text-primary-500 hover:border-secondary-300 hover:text-secondary-500'
                      }`}
                    >
                      {t('opportunityTypeOther')}
                    </button>
                  ) : null}
                </MotionDiv>

                <MotionDiv className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
                  {filteredOpportunities.length === 0 ? (
                    <p className="text-primary-400">{t('emptyOpportunities')}</p>
                  ) : null}
                  {paginatedOpportunities.map((opportunity) => (
                    <motion.div key={opportunity.id} variants={fadeUp} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
                      <OpportunityCard opportunity={opportunity} />
                    </motion.div>
                  ))}
                </MotionDiv>

                {shouldPaginate ? (
                  <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page <= 1}
                      className="cursor-pointer rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="text-xs font-semibold text-primary-400">{page} / {totalPages}</span>
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page >= totalPages}
                      className="cursor-pointer rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </MotionDiv>
        ) : (
          <MotionForm
            className="mt-7 space-y-5 rounded-2xl border border-primary-100 bg-white p-6 shadow-md"
            onSubmit={handleSubmit}
            noValidate
            variants={fadeUp}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label={t('formTitre')}
                name="titre"
                value={formValues.titre}
                onChange={handleChange}
                error={formErrors.titre}
                required
              />
              <InputField
                label={t('cardVille')}
                name="ville"
                value={formValues.ville}
                onChange={handleChange}
                error={formErrors.ville}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label={t('formFirstName')}
                name="first_name"
                value={formValues.first_name}
                onChange={handleChange}
                error={formErrors.first_name}
                required
              />
              <InputField
                label={t('formLastName')}
                name="last_name"
                value={formValues.last_name}
                onChange={handleChange}
                error={formErrors.last_name}
                required
              />
            </div>

            <TextareaField
              label={t('formDescription')}
              name="description"
              value={formValues.description}
              onChange={handleChange}
              rows={5}
              error={formErrors.description}
              required
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label={t('formBudget')}
                type="number"
                name="budget"
                value={formValues.budget}
                onChange={handleChange}
                error={formErrors.budget}
              />
              <InputField
                label={t('formPhone')}
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                error={formErrors.phone}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label={t('formEmail')}
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                error={formErrors.email}
                required
              />

              <label className="block text-sm font-medium text-primary-500">
                <span>{t('formType')}<span className="ml-0.5 text-red-500">*</span></span>
                <select
                  className="mt-2 block w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-primary-500 shadow-sm outline-none transition focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20"
                  name="type_key"
                  value={formValues.type_key}
                  onChange={handleChange}
                >
                  <option value="">{t('formSelectType')}</option>
                  {staticTypeOptions.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {formErrors.type_key ? (
                  <span className="mt-1 block text-xs text-secondary-600">{formErrors.type_key}</span>
                ) : null}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label={t('formImage')}
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                onClick={(event) => {
                  event.currentTarget.value = ''
                }}
              />
            </div>

            {formErrors.images ? (
              <span className="block text-xs text-secondary-600">{formErrors.images}</span>
            ) : null}

            {formValues.images.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-primary-400">
                  {formValues.images.length} file(s) selected
                </p>
                <div className="space-y-1">
                  {formValues.images.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 px-3 py-2 text-xs text-primary-500">
                      <span className="truncate pr-2">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        className="rounded-md px-2 py-1 font-semibold text-secondary-500 hover:bg-secondary-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {submitMutation.isError ? (
              <ErrorState message={getFriendlyServerError(submitMutation.error)} />
            ) : null}
            {submitMutation.isSuccess ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {t('opportunitySuccess')}
              </p>
            ) : null}

            <Button type="submit" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? t('sending') : t('submit')}
            </Button>
          </MotionForm>
        )}
      </MotionDiv>
    </SectionContainer>
  )
}

export default OpportunitiesPage
