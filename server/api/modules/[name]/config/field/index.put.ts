import type { MageNewSystemConfigField } from '~/lib/types'
import { getModule, getModuleSystemConfig } from '~/lib/mage/modules'
import addSystemXmlField from '~/lib/mage/modules/add-system-xml-field'
import writeSystemXml from '~/lib/mage/modules/write-system-xml'
import setConfigXmlValue from '~/lib/mage/modules/set-config-xml-value'
import writeConfigXml from '~/lib/mage/modules/write-config-xml'
import getConfigXml from '~/lib/mage/modules/get-config-xml'

export default defineEventHandler(async (event) => {
  const field: MageNewSystemConfigField = await readBody(event)
  const config = getModuleSystemConfig(field.module)
  const systemConfig = addSystemXmlField(field, config)
  writeSystemXml(systemConfig, getModule(field.module))

  if (field.default !== undefined) {
    const configXml = getConfigXml(getModule(field.module))
    const updatedXml = setConfigXmlValue(field, configXml)
    writeConfigXml(updatedXml, getModule(field.module))
  }
})
