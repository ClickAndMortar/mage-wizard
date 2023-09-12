import cache from '~/lib/cache'
import type { MageWizardSettings } from '~/lib/types'

export default function (): MageWizardSettings | undefined {
  return cache.get<MageWizardSettings>('settings')
}
