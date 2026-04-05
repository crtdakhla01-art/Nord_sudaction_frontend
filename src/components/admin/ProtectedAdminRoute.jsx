import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAdminToken, getAdminUser } from '../../api/adminClient'

function ProtectedAdminRoute({ allowedRoles }) {
  const location = useLocation()
  const token = getAdminToken()
  const user = getAdminUser()
  const role = user?.role?.name

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedAdminRoute
