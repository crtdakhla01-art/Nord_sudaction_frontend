import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../api/posts'

export const usePosts = (params) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => fetchPosts(params),
  })
}
