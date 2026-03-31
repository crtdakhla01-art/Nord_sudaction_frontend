import { ADMIN_TOKEN_KEY } from './adminClient'

const getBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000/api`

const authHeaders = ({ json = false } = {}) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  const headers = {
    Accept: 'application/json',
  }

  if (json) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

const handleResponse = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Request failed')
  return data
}

export const fetchAdminActivities = async () => {
  const res = await fetch(`${getBaseUrl()}/admin/activities`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export const createActivity = async (payload) => {
  const res = await fetch(`${getBaseUrl()}/admin/activities`, {
    method: 'POST',
    headers: authHeaders({ json: true }),
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export const updateActivity = async ({ id, values }) => {
  const res = await fetch(`${getBaseUrl()}/admin/activities/${id}`, {
    method: 'PUT',
    headers: authHeaders({ json: true }),
    body: JSON.stringify(values),
  })
  return handleResponse(res)
}

export const deleteActivity = async (id) => {
  const res = await fetch(`${getBaseUrl()}/admin/activities/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res)
}
