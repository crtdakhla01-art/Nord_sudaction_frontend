import { publicApi } from './client'

export const fetchPosts = async (params = {}) => {
  const { data } = await publicApi.get('/posts', { params })
  return data
}
