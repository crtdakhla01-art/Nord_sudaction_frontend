import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api/adminClient'

export const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'user', 'me'],
    queryFn: async () => {
      try {
        const { data } = await adminApi.get('/admin/me')
        return data?.user || null
      } catch {
        return null
      }
    },
    // Check auth status on mount and periodically.
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  return {
    user,
    isLoading,
    isError,
    role: user?.role?.name || null,
    isAuthenticated: Boolean(user),
  }
}
