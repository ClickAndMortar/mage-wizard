import getSettings from '~/lib/settings'

export default defineEventHandler(() => {
  const settings = getSettings()
  if (!settings) {
    return createError({
      statusCode: 404,
      message: 'Settings not found',
    })
  }

  return settings
})
