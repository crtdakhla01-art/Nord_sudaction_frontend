import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useAdminAuth } from '../hooks/useAdminAuth'

function AdminLayout() {
  const { logoutMutation, role, user } = useAdminAuth()
  const { t } = useTranslation()

  const navClass = ({ isActive }) =>
    `block rounded-xl px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-[#d9242b] text-white'
        : 'text-primary-300 hover:bg-primary-700 hover:text-white'
    }`

  return (
    <div className="min-h-screen w-full bg-primary-50 text-primary-500">
      <aside className="fixed inset-y-0 left-0 h-screen w-[250px] overflow-y-auto bg-[#3c3c3c] px-5 py-6 text-white">
        <p className="text-xl font-black">NSA Admin</p>
        <p className="mt-1 text-xs text-primary-200">{role === 'manager' ? t('managerPanel') : t('dashboard')}</p>

        <nav className="mt-8 space-y-2">
          {role === 'admin' ? (
            <NavLink to="/admin" end className={navClass}>
              {t('overview')}
            </NavLink>
          ) : null}
          <NavLink to="/admin/opportunities" className={navClass}>
            {t('navOpportunities')}
          </NavLink>
          {role === 'admin' ? (
            <NavLink to="/admin/posts" className={navClass}>
              Actualites
            </NavLink>
          ) : null}
          {role === 'admin' ? (
            <NavLink to="/admin/events" className={navClass}>
              {t('navEvents')}
            </NavLink>
          ) : null}
          {role === 'admin' ? (
            <NavLink to="/admin/activities" className={navClass}>
              Activités
            </NavLink>
          ) : null}
          {role === 'admin' ? (
            <span className="block rounded-xl px-4 py-2 text-sm font-semibold text-primary-200">{t('users')}</span>
          ) : null}
        </nav>
      </aside>

      <div className="ml-[250px] min-h-screen w-[calc(100%-250px)]">
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-primary-100 bg-white px-8 py-4">
            <div>
              <h1 className="text-lg font-bold text-primary-500">{t('adminDashboardTitle')}</h1>
              <p className="text-xs text-primary-400">
                {user?.email || t('unknownUser')} · {role || t('noRole')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                className="rounded-xl bg-secondary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600"
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? t('loggingOut') : t('logout')}
              </button>
            </div>
          </header>

          <main className="flex-1 px-8 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
