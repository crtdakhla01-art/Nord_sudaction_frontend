import { publicApi } from './client'

export const submitContactMessage = async (formValues) => {
  const { data } = await publicApi.post('/contact', formValues)
  return data
}
