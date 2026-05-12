import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

function ProtectedAdminRoute({ allowedRoles }) {
  const location = useLocation()
  const { role, isAuthenticated, isLoading } = useUser()

  // While checking auth status from server, show loading placeholder.
  if (isLoading) {
    return <div className="min-h-screen bg-white" />
  }

  // Not authenticated: redirect to login.
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  // Authenticated but role not allowed: redirect to home.
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedAdminRoute
