import { XMLBuilder } from 'fast-xml-parser'
import type { MageConfigXml } from '~/lib/types'

export default (config: MageConfigXml): string => {
  const configXmlObject: any = {
    '?xml': { '@_version': '1.0' },
    config: {
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xsi:noNamespaceSchemaLocation': 'urn:magento:module:Magento_Store:etc/config.xsd',
      default: {},
    },
  }

  if (config.default && Object.keys(config.default).length > 0) {
    configXmlObject.config.default = config.default
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    indentBy: '    ',
  })

  return builder.build(configXmlObject)
}
