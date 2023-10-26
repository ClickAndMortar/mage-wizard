import { createPatch, getModule } from '~/lib/mage/modules'
import type { MageNewPatch } from '~/lib/types'

export default defineEventHandler(async (event) => {
  const moduleName = event.context?.params?.name
  if (!moduleName) {
    throw new Error('Missing module name')
  }

  const module = getModule(moduleName)

  const patch: MageNewPatch = await readBody(event)
  await createPatch(module, patch)
})
