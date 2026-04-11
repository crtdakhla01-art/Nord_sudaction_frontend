import { publicApi } from './client'

export const subscribeNewsletter = async (formValues) => {
  const { data } = await publicApi.post('/newsletter/subscribe', formValues)
  return data
}
