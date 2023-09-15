import type { MageCrontabXmlJob } from '~/lib/types'
import { getModule } from '~/lib/mage/modules'
import getCrontabXml from '~/lib/mage/modules/get-crontab-xml'
import writeCrontabXml from '~/lib/mage/modules/write-crontab-xml'
import addCrontabXmlJob from '~/lib/mage/modules/add-crontab-xml-job'

export default defineEventHandler(async (event) => {
  const moduleName = event.context?.params?.name
  if (!moduleName) {
    throw new Error('Missing module name')
  }

  const module = getModule(moduleName)

  const job: MageCrontabXmlJob = await readBody(event)
  const crontabXml = getCrontabXml(module)
  const crontabXmlUpdated = addCrontabXmlJob(job, crontabXml)
  writeCrontabXml(crontabXmlUpdated, module)
})
