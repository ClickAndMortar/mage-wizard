import { getModules } from '~/lib/mage/modules'

export default defineEventHandler(() => {
  return getModules()
})
