export default defineEventHandler((event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) return

  event.context.user = {
    id: Number(userId)
  }
})
