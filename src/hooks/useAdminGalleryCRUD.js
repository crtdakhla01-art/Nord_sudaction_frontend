import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createGalleryCategory,
  deleteGalleryCategory,
  deleteGalleryImage,
  fetchAdminGallery,
  fetchGalleryCategories,
  updateGalleryImageCategory,
  uploadGalleryImages,
} from '../api/adminGallery'

export const useAdminGalleryCRUD = (page = 1) => {
  const queryClient = useQueryClient()

  const galleryQuery = useQuery({
    queryKey: ['admin', 'gallery', page],
    queryFn: () => fetchAdminGallery(page),
  })

  const categoriesQuery = useQuery({
    queryKey: ['gallery-categories'],
    queryFn: fetchGalleryCategories,
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

  const updateCategoryMutation = useMutation({
    mutationFn: updateGalleryImageCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: createGalleryCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-categories'] })
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteGalleryCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-categories'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })

  return {
    galleryQuery,
    categoriesQuery,
    uploadMutation,
    deleteMutation,
    updateCategoryMutation,
    createCategoryMutation,
    deleteCategoryMutation,
  }
}
