import type { MageWizardSettings } from '~/lib/types'
import cache from '~/lib/cache'

export default defineEventHandler(async (event) => {
  const settings: MageWizardSettings = await readBody(event)
  cache.set('settings', settings)
})
