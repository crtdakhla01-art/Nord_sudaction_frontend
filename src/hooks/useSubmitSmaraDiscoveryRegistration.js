import { useMutation } from '@tanstack/react-query'
import { submitSmaraDiscoveryRegistration } from '../api/smaraDiscoveryRegistrations'

export const useSubmitSmaraDiscoveryRegistration = () => {
  return useMutation({
    mutationFn: submitSmaraDiscoveryRegistration,
  })
}
