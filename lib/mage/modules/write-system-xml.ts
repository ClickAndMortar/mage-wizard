import fs from 'node:fs'
import type { MageModule, MageSystemConfig } from '~/lib/types'
import generateSystemXml from '~/lib/mage/modules/generate-system-xml'
import getSettings from '~/lib/settings'

export default function (config: MageSystemConfig, module: MageModule): void {
  const xml = generateSystemXml(config)
  const modulePath = `${getSettings()?.path}/${module.relativePath}`

  fs.mkdirSync(`${modulePath}/etc/adminhtml`, { recursive: true })
  fs.writeFileSync(`${modulePath}/etc/adminhtml/system.xml`, xml)
}
