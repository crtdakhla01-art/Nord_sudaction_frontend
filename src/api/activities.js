const getBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000/api`

export const fetchActivities = async () => {
  const res = await fetch(`${getBaseUrl()}/admin/activities`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to fetch activities')
  return res.json()
}
