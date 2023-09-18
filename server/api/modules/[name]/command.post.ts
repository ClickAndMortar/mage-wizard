import { createCommand } from '~/lib/mage/modules'
import type { MageNewCommand } from '~/lib/types'

export default defineEventHandler(async (event) => {
  const command: MageNewCommand = await readBody(event)
  await createCommand(command)
})
