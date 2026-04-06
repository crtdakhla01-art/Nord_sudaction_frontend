import { Navigate, useNavigate } from 'react-router-dom'
import { getAdminToken, getOtpContext } from '../../api/adminClient'
import ErrorState from '../../components/ErrorState'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import usePreventDoubleSubmit from '../../hooks/usePreventDoubleSubmit'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function AdminVerifyOtpPage() {
  const { verifyOtpMutation } = useAdminAuth()
  const { t } = useTranslation()
  const { wrap } = usePreventDoubleSubmit()
  const navigate = useNavigate()
  const otpContext = getOtpContext()
  const [otpCode, setOtpCode] = useState('')

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />
  }

  if (!otpContext?.email) {
    return <Navigate to="/admin/login" replace />
  }

  const onSubmit = wrap(async (event) => {
    event.preventDefault()

    try {
      await verifyOtpMutation.mutateAsync({
        email: otpContext.email,
        code: otpCode,
      })
    } catch {
      // Error is rendered via verifyOtpMutation.isError.
    }
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <form className="w-full max-w-md space-y-5 rounded-2xl border border-primary-100 bg-white p-7 shadow-lg" onSubmit={onSubmit}>
        <div>
          <h1 className="text-2xl font-black text-primary-500">{t('verifyOtpTitle')}</h1>
          <p className="mt-1 text-sm text-primary-400">{t('verifyOtpSubtitle', { email: otpContext.email })}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-500">{t('verificationCode')}</label>
          <input
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-center text-lg tracking-[0.35em] outline-none transition focus:ring-2 focus:ring-secondary-500"
            name="otp"
            type="text"
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            pattern="\d{6}"
            required
          />
        </div>

        {verifyOtpMutation.isError ? (
          <ErrorState
            message={
              verifyOtpMutation.error?.response?.data?.errors?.code?.[0] ||
              verifyOtpMutation.error?.response?.data?.message ||
              verifyOtpMutation.error?.message
            }
          />
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-secondary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-secondary-600"
          disabled={verifyOtpMutation.isPending}
        >
          {verifyOtpMutation.isPending ? t('verifying') : t('verifyCode')}
        </button>

        <button
          type="button"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-primary-500 transition hover:bg-primary-50"
          onClick={() => navigate('/admin/login', { replace: true })}
        >
          {t('backToLogin')}
        </button>
      </form>
    </div>
  )
}

export default AdminVerifyOtpPage
