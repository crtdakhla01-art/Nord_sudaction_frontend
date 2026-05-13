import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api/adminClient'
import { authDebug } from '../utils/authDebug'

export const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'user', 'me'],
    queryFn: async () => {
      try {
        authDebug.log('[SESSION]', 'Fetching /admin/me')
        const { data } = await adminApi.get('/admin/me')
        authDebug.log('[SESSION]', '/admin/me success', {
          userId: data?.user?.id,
          role: data?.user?.role?.name,
        })
        return data?.user || null
      } catch {
        authDebug.warn('[SESSION]', '/admin/me failed; treating as unauthenticated')
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
