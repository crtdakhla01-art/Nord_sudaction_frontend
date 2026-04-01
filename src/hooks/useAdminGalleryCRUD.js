import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteGalleryImage, fetchAdminGallery, uploadGalleryImages } from '../api/adminGallery'

export const useAdminGalleryCRUD = (page = 1) => {
  const queryClient = useQueryClient()

  const galleryQuery = useQuery({
    queryKey: ['admin', 'gallery', page],
    queryFn: () => fetchAdminGallery(page),
  })

  const uploadMutation = useMutation({
    mutationFn: uploadGalleryImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })

  return {
    galleryQuery,
    uploadMutation,
    deleteMutation,
  }
}
