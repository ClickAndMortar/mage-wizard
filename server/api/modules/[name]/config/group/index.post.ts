import type { MageNewSystemConfigGroup } from '~/lib/types'
import { getModule, getModuleSystemConfig } from '~/lib/mage/modules'
import addSystemXmlGroup from '~/lib/mage/modules/add-system-xml-group'
import writeSystemXml from '~/lib/mage/modules/write-system-xml'

export default defineEventHandler(async (event) => {
  const module = event.context.params?.name as string

  const group: MageNewSystemConfigGroup = await readBody(event)
  const config = getModuleSystemConfig(module)
  const systemConfig = addSystemXmlGroup(group, config)
  writeSystemXml(systemConfig, getModule(module))
})
