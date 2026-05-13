import { publicApi } from './client'
import { normalizeEmail, normalizePhone } from '../utils/validation'

export const submitContactMessage = async (formValues) => {
  const payload = {
    ...formValues,
    email: normalizeEmail(formValues.email),
    phone: normalizePhone(formValues.phone),
  }

  const { data } = await publicApi.post('/contact', payload)
  return data
}
