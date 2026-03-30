import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  image: null,
}

function OpportunitiesPage() {
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

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (event) => {
    const { name, value, files } = event.target
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'image' ? files?.[0] || null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) return

    await submitMutation.mutateAsync(formValues)
    setFormValues(initialForm)
    setFormErrors({})
  }

  const tabClass = (tab) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
      activeTab === tab
        ? 'bg-secondary-500 text-white shadow'
        : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500'
    }`

  return (
    <SectionContainer>
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-primary-500 md:text-5xl">{t('opportunitiesPageTitle')}</h1>

        <div className="mt-6 inline-flex items-center gap-1 rounded-xl border border-primary-100 bg-white p-1 shadow-sm">
          <button type="button" className={tabClass('list')} onClick={() => setActiveTab('list')}>
            {t('opportunitiesViewTab')}
          </button>
          <button type="button" className={tabClass('submit')} onClick={() => setActiveTab('submit')}>
            {t('opportunitiesSubmitTab')}
          </button>
        </div>

        {activeTab === 'list' ? (
          <div className="mt-7">
            {isLoading ? <LoadingState /> : null}
            {isError ? <ErrorState message={error?.message} /> : null}
            {!isLoading && !isError ? (
              <>
                <div className="mb-6 flex flex-wrap gap-2">
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
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {filteredOpportunities.length === 0 ? (
                    <p className="text-primary-400">{t('emptyOpportunities')}</p>
                  ) : null}
                  {paginatedOpportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>

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
          </div>
        ) : (
          <form
            className="mt-7 space-y-5 rounded-2xl border border-primary-100 bg-white p-6 shadow-md"
            onSubmit={handleSubmit}
            noValidate
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
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            {submitMutation.isError ? (
              <ErrorState message={submitMutation.error?.response?.data?.message || submitMutation.error?.message} />
            ) : null}
            {submitMutation.isSuccess ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {t('opportunitySuccess')}
              </p>
            ) : null}

            <Button type="submit" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? t('sending') : t('submit')}
            </Button>
          </form>
        )}
      </div>
    </SectionContainer>
  )
}

export default OpportunitiesPage
