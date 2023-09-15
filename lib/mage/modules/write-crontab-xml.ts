import fs from 'node:fs'
import type { MageCrontabXml, MageModule } from '~/lib/types'
import getSettings from '~/lib/settings'
import generateCrontabXml from '~/lib/mage/modules/generate-crontab-xml'

export default function (crontab: MageCrontabXml, module: MageModule): void {
  const xml = generateCrontabXml(crontab)
  const modulePath = `${getSettings()?.path}/${module.relativePath}`

  fs.writeFileSync(`${modulePath}/etc/crontab.xml`, xml)
}
