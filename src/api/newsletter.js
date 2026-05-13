import { publicApi } from './client'
import { normalizeEmail } from '../utils/validation'

export const subscribeNewsletter = async (formValues) => {
  const payload = {
    ...formValues,
    email: normalizeEmail(formValues.email),
  }

  const { data } = await publicApi.post('/newsletter/subscribe', payload)
  return data
}
