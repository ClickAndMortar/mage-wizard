import type { MageNewSystemConfigSection } from '~/lib/types'
import { getModule, getModuleSystemConfig } from '~/lib/mage/modules'
import addSystemXmlSection from '~/lib/mage/modules/add-system-xml-section'
import writeSystemXml from '~/lib/mage/modules/write-system-xml'

export default defineEventHandler(async (event) => {
  const module = event.context.params?.name as string

  const section: MageNewSystemConfigSection = await readBody(event)
  const config = getModuleSystemConfig(module)
  const systemConfig = addSystemXmlSection(section, config)
  writeSystemXml(systemConfig, getModule(module))
})
