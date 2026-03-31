const getBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL

export const fetchActivities = async () => {
  const res = await fetch(`${getBaseUrl()}/activities`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to fetch activities')
  return res.json()
}
