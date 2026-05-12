import { useQuery } from '@tanstack/react-query'
import { fetchPosts, fetchPostBySlug } from '../api/posts'

export const usePosts = (params) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => fetchPosts(params),
  })
}

export const usePost = (slug) => {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: !!slug,
  })
}
