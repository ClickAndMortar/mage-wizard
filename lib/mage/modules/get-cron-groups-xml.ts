import fs from 'node:fs'
import { XMLParser } from 'fast-xml-parser'
import type { MageCronGroupXmlGroup, MageCronGroupXml } from '~/lib/types'
import getSettings from '~/lib/settings'
import { getModules } from '~/lib/mage/modules'

export default function (): MageCronGroupXml {
  const cronGroup: MageCronGroupXml = {
    groups: [],
  }

  for (const module of getModules()) {
    const cronGroupXmlPath = `${getSettings()?.path}/${module.relativePath}/etc/cron_groups.xml`
    if (!fs.existsSync(cronGroupXmlPath)) {
      continue
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (_tagName, path) => {
        return ['config.group'].includes(path)
      },
    })

    const cronGroupXml = parser.parse(fs.readFileSync(cronGroupXmlPath, 'utf8'))
    if (!cronGroupXml.config || !cronGroupXml.config.group) {
      continue
    }

    for (const group of cronGroupXml.config.group) {
      if (cronGroup.groups.some((cronGroup) => cronGroup.id === group['@_id'])) {
        continue
      }

      const groupObject: MageCronGroupXmlGroup = {
        id: group['@_id'],
        scheduleGenerateEvery: group.schedule_generate_every,
        scheduleAheadFor: group.schedule_ahead_for,
        scheduleLifetime: group.schedule_lifetime,
        historyCleanupEvery: group.history_cleanup_every,
        historySuccessLifetime: group.history_success_lifetime,
        historyFailureLifetime: group.history_failure_lifetime,
        useSeparateProcess: group.use_separate_process,
      }

      cronGroup.groups.push(groupObject)
    }
  }

  // Sort groups by id property alphabetically
  cronGroup.groups.sort((a, b) => a.id.localeCompare(b.id))

  return cronGroup
}
