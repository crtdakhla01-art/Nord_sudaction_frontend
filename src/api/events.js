import { publicApi } from './client'

export const fetchEvents = async () => {
  const { data } = await publicApi.get('/events')
  return data
}

export const fetchEvent = async (id) => {
  const { data } = await publicApi.get(`/events/${id}`)
  return data
}
