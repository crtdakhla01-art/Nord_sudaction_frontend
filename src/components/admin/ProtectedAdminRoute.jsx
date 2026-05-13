import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { authDebug } from '../../utils/authDebug'

function ProtectedAdminRoute({ allowedRoles }) {
  const location = useLocation()
  const { role, isAuthenticated, isLoading } = useUser()

  authDebug.log('[ROUTE GUARD]', 'Evaluating protected route', {
    path: location.pathname,
    isLoading,
    isAuthenticated,
    role,
    allowedRoles,
  })

  // While checking auth status from server, show loading placeholder.
  if (isLoading) {
    return <div className="min-h-screen bg-white" />
  }

  // Not authenticated: redirect to login.
  if (!isAuthenticated) {
    authDebug.warn('[ROUTE GUARD]', 'Blocking access: unauthenticated', {
      path: location.pathname,
    })
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  // Authenticated but role not allowed: redirect to home.
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    authDebug.warn('[ROUTE GUARD]', 'Blocking access: role not allowed', {
      path: location.pathname,
      role,
      allowedRoles,
    })
    return <Navigate to="/" replace />
  }

  authDebug.log('[ROUTE GUARD]', 'Access granted', {
    path: location.pathname,
    role,
  })

  return <Outlet />
}

export default ProtectedAdminRoute
