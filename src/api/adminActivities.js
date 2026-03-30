import { ADMIN_TOKEN_KEY } from './adminClient'

const getBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000/api`

const authHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_KEY)}`,
})

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
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export const updateActivity = async ({ id, values }) => {
  const res = await fetch(`${getBaseUrl()}/admin/activities/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
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
