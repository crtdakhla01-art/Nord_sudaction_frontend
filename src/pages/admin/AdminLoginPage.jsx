import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'
import { getAdminToken, setOtpContext } from '../../api/adminClient'
import ErrorState from '../../components/ErrorState'
import { useAdminAuth } from '../../hooks/useAdminAuth'

function AdminLoginPage() {
  const { loginMutation } = useAdminAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    email: '',
    password: '',
  })

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      await loginMutation.mutateAsync(values)
      setOtpContext({
        email: values.email,
      })
      navigate('/admin/verify-otp', { replace: true })
    } catch {
      // Error is rendered via loginMutation.isError.
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <form className="w-full max-w-md space-y-5 rounded-2xl border border-primary-100 bg-white p-7 shadow-lg" onSubmit={onSubmit}>
        <div>
          <h1 className="text-2xl font-black text-primary-500">{t('adminAccessTitle')}</h1>
          <p className="mt-1 text-sm text-primary-400">{t('adminSignInSubtitle')}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-500">Email</label>
          <input
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-secondary-500"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-500">Password</label>
          <input
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-secondary-500"
            name="password"
            type="password"
            value={values.password}
            onChange={onChange}
            required
          />
        </div>

        {loginMutation.isError ? (
          <ErrorState
            message={
              loginMutation.error?.response?.data?.errors?.email?.[0] ||
              loginMutation.error?.response?.data?.message ||
              loginMutation.error?.message
            }
          />
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-secondary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-secondary-600"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? t('verifying') : t('continue')}
        </button>
      </form>
    </div>
  )
}

export default AdminLoginPage
