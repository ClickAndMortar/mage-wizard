import { getModule } from '~/lib/mage/modules'

export default defineEventHandler((event) => {
  const name = event.context?.params?.name
  if (!name) {
    throw new Error('Missing module name')
  }

  try {
    return getModule(name)
  } catch {
    return createError({ statusCode: 404 })
  }
})
