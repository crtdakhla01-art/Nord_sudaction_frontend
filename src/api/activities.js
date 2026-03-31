import { publicApi } from './client'

export const fetchActivities = async () => {
  try {
    const { data } = await publicApi.get('/activities')
    return data
  } catch (error) {
    if (error?.response?.status === 404) {
      const { data } = await publicApi.get('/admin/activities')
      return data
    }

    throw new Error(error?.response?.data?.message || error?.message || 'Failed to fetch activities')
  }
}
