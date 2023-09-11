import type { MageNewSystemConfigField } from '~/lib/types'
import { getModule, getModuleSystemConfig } from '~/lib/mage/modules'
import addSystemXmlField from '~/lib/mage/modules/add-system-xml-field'
import writeSystemXml from '~/lib/mage/modules/write-system-xml'

export default defineEventHandler(async (event) => {
  const field: MageNewSystemConfigField = await readBody(event)
  const config = getModuleSystemConfig(field.module)
  const systemConfig = addSystemXmlField(field, config)
  writeSystemXml(systemConfig, getModule(field.module))
})
