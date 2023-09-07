import { getSystemConfigs } from '~/lib/mage/modules'

export default defineEventHandler(() => {
  return getSystemConfigs()
})
