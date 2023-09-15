import { XMLBuilder } from 'fast-xml-parser'
import type { MageCrontabXml } from '~/lib/types'

export default (crontab: MageCrontabXml): string => {
  const crontabXmlObject: any = {
    '?xml': { '@_version': '1.0' },
    config: {
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xsi:noNamespaceSchemaLocation': 'urn:magento:module:Magento_Cron:etc/crontab.xsd',
      group: [],
    },
  }

  for (const job of crontab.jobs) {
    if (!crontabXmlObject.config.group[job.group]) {
      crontabXmlObject.config.group[job.group] = {
        '@_id': job.group,
        job: [],
      }
    }

    crontabXmlObject.config.group[job.group].job.push({
      '@_name': job.name,
      '@_instance': job.instance,
      '@_method': job.method,
      schedule: job.schedule,
      config_path: job.configPath,
    })
  }

  crontabXmlObject.config.group = Object.values(crontabXmlObject.config.group)

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    indentBy: '    ',
  })

  return builder.build(crontabXmlObject)
}
