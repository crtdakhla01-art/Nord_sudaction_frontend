import { publicApi } from './client'

export const fetchAdvertisements = async () => {
  const { data } = await publicApi.get('/advertisements')
  return data
}
