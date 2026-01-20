import { deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  deleteCookie(event, 'user_id', {
    path: '/'
  })

  return {
    success: true
  }
})
