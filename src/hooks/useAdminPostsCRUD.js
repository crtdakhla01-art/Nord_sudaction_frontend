import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminPost, deleteAdminPost, fetchAdminPosts, updateAdminPost } from '../api/adminPosts'

export const useAdminPostsCRUD = (filters) => {
  const queryClient = useQueryClient()

  const postsQuery = useQuery({
    queryKey: ['admin', 'posts', filters],
    queryFn: () => fetchAdminPosts(filters),
  })

  const createMutation = useMutation({
    mutationFn: createAdminPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateAdminPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] })
    },
  })

  return {
    postsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
