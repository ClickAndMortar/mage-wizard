import { XMLBuilder } from 'fast-xml-parser'
import type { MageModule } from '~/lib/types'

export default function (module: MageModule): string {
  const moduleXml = {
    '?xml': {
      '@_version': '1.0',
    },
    config: {
      module: {
        '@_name': `${module.namespace}_${module.name}`,
      },
      // TODO: dependencies
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xsi:noNamespaceSchemaLocation': 'urn:magento:framework:Module/etc/module.xsd',
    },
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  })

  return builder.build(moduleXml)
}
