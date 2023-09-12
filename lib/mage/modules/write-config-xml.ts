import fs from 'node:fs'
import type { MageConfigXml, MageModule } from '~/lib/types'
import useMageRoot from '~/composables/use-mage-root'
import generateConfigXml from '~/lib/mage/modules/generate-config-xml'

const basePath = useMageRoot()

export default function (config: MageConfigXml, module: MageModule): void {
  const xml = generateConfigXml(config)
  const modulePath = `${basePath}/${module.relativePath}`

  fs.writeFileSync(`${modulePath}/etc/config.xml`, xml)
}
