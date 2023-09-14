import { XMLBuilder } from 'fast-xml-parser'
import type { MageModule, MageNewModule } from '~/lib/types'

export default function (module: MageModule | MageNewModule): string {
  const moduleXml: any = {
    '?xml': {
      '@_version': '1.0',
    },
    config: {
      module: {
        '@_name': `${module.namespace}_${module.name}`,
      },
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xsi:noNamespaceSchemaLocation': 'urn:magento:framework:Module/etc/module.xsd',
    },
  }

  if (module.dependencies && module.dependencies.length > 0) {
    moduleXml.config.module.sequence = {
      module: [],
    }

    for (const dependency of module.dependencies) {
      moduleXml.config.module.sequence.module.push({
        '@_name': dependency,
      })
    }
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  })

  return builder.build(moduleXml)
}
