import { createModule } from '~/lib/mage/modules'
import type { MageNewModule } from '~/lib/types'

export default defineEventHandler(async (event) => {
  const module: MageNewModule = await readBody(event)
  createModule(module)
})
