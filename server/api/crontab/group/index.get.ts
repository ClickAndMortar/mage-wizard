import type { MageCronGroupXmlGroup } from '~/lib/types'
import getCronGroupsXml from '~/lib/mage/modules/get-cron-groups-xml'

export default defineEventHandler((): MageCronGroupXmlGroup[] => {
  return getCronGroupsXml().groups
})
