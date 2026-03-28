import { useMutation } from '@tanstack/react-query'
import { submitContactMessage } from '../api/contact'

export const useSubmitContactMessage = () => {
  return useMutation({
    mutationFn: submitContactMessage,
  })
}
