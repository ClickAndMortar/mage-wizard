import type { MageCrontabXmlJob, MageCrontabXml } from '~/lib/types'

export default (job: MageCrontabXmlJob, crontab: MageCrontabXml): MageCrontabXml => {
  for (const [key, value] of Object.entries(crontab.jobs)) {
    if (value.name === job.name) {
      crontab.jobs[Number.parseInt(key)] = job
      return crontab
    }
  }

  crontab.jobs.push(job)

  return crontab
}
