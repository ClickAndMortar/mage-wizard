import fs from 'node:fs'
import { XMLParser } from 'fast-xml-parser'
import type { MageCrontabXml, MageCrontabXmlJob, MageModule } from '~/lib/types'
import getSettings from '~/lib/settings'

export default function (module: MageModule): MageCrontabXml {
  const crontab: MageCrontabXml = {
    jobs: [],
  }

  const crontabXmlPath = `${getSettings()?.path}/${module.relativePath}/etc/crontab.xml`
  if (!fs.existsSync(crontabXmlPath)) {
    return crontab
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (_tagName, path) => {
      return ['config.group', 'config.group.job'].includes(path)
    },
  })

  const crontabXml = parser.parse(fs.readFileSync(crontabXmlPath, 'utf8'))
  if (!crontabXml.config || !crontabXml.config.group) {
    return crontab
  }

  for (const group of crontabXml.config.group) {
    if (!group.job) {
      continue
    }

    for (const job of group.job) {
      const jobObject: MageCrontabXmlJob = {
        group: group['@_id'],
        name: job['@_name'],
        instance: job['@_instance'],
        method: job['@_method'],
        schedule: job.schedule,
        configPath: job.config_path,
      }

      crontab.jobs.push(jobObject)
    }
  }

  return crontab
}
