import { useQuery } from '@tanstack/react-query'
import { fetchOpportunityTypes } from '../api/opportunities'

export const useOpportunityTypes = () => {
  return useQuery({
    queryKey: ['opportunityTypes'],
    queryFn: fetchOpportunityTypes,
  })
}
