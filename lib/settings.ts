import cache from '~/lib/cache'
import type { MageWizardSettings } from '~/lib/types'

export default function (): MageWizardSettings | undefined {
  const cachedSettings = cache.get('settings')
  return cachedSettings && cachedSettings.value ? JSON.parse(cachedSettings.value) : undefined
}
