import { publicApi } from './client'

export const fetchPosts = async (params = {}) => {
  const { data } = await publicApi.get('/posts', { params })
  return data
}

export const fetchPost = async (slug) => {
  const { data } = await publicApi.get(`/posts/${slug}`)
  return data
}
