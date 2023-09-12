import fs from 'node:fs'
import { XMLParser } from 'fast-xml-parser'
import type { MageConfigXml, MageModule } from '~/lib/types'
import useMageRoot from '~/composables/use-mage-root'

const basePath = useMageRoot()

export default function (module: MageModule): MageConfigXml {
  const config: MageConfigXml = {
    default: {},
  }

  const configXmlPath = `${basePath}/${module.relativePath}/etc/config.xml`
  if (!fs.existsSync(configXmlPath)) {
    return config
  }

  const parser = new XMLParser({
    ignoreAttributes: true,
  })

  const configXml = parser.parse(fs.readFileSync(configXmlPath, 'utf8'))
  if (!configXml.config || !configXml.config.default) {
    return config
  }

  config.default = configXml.config.default

  return config
}
