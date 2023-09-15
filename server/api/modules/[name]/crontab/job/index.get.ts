import getCrontabXml from '~/lib/mage/modules/get-crontab-xml'
import { getModule } from '~/lib/mage/modules'

export default defineEventHandler((event) => {
  const moduleName = event.context?.params?.name
  if (!moduleName) {
    throw new Error('Missing module name')
  }

  const query = getQuery(event)
  const jobName = query.name as string

  const jobs = getCrontabXml(getModule(moduleName)).jobs

  if (jobName) {
    const job = jobs.find((job) => job.name === jobName)
    if (!job) {
      throw new Error('Job not found')
    }
    return job
  }

  return jobs
})
