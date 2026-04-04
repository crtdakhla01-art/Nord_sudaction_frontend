import { useQuery } from '@tanstack/react-query'
import { fetchPost } from '../api/posts'

export const usePost = (slug) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug),
    enabled: Boolean(slug),
  })
}
