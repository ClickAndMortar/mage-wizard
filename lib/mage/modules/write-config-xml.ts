import fs from 'node:fs'
import type { MageConfigXml, MageModule } from '~/lib/types'
import generateConfigXml from '~/lib/mage/modules/generate-config-xml'
import getSettings from '~/lib/settings'

export default function (config: MageConfigXml, module: MageModule): void {
  const xml = generateConfigXml(config)
  const modulePath = `${getSettings()?.path}/${module.relativePath}`

  fs.writeFileSync(`${modulePath}/etc/config.xml`, xml)
}
