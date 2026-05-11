import { useMutation } from '@tanstack/react-query'
import { submitInscription } from '../api/inscriptions'

export const useSubmitInscription = () => {
  return useMutation({
    mutationFn: submitInscription,
  })
}
