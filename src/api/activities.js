import { publicApi } from './client'

export const fetchActivities = async () => {
  const { data } = await publicApi.get('/activities')
  return data
}
