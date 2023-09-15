import { JSONPath } from 'jsonpath-plus'
import type { MageSystemConfigField } from '~/lib/types'
import { getModuleSystemConfig } from '~/lib/mage/modules'

export default defineEventHandler((event): MageSystemConfigField => {
  const moduleName = event.context?.params?.name
  if (!moduleName) {
    throw new Error('Missing module name')
  }

  const query = getQuery(event)
  const path = query.path as string
  if (!path) {
    throw new Error('Missing path query parameter')
  }

  const [sectionId, groupId, fieldId] = path.split('/')

  const config = getModuleSystemConfig(moduleName)

  const field = JSONPath({
    path: `$.sections[?(@.id == "${sectionId}")].groups[?(@.id == "${groupId}")].fields[?(@.id == "${fieldId}")]`,
    json: config,
  })

  if (!field || field.length === 0) {
    throw new Error('Field not found')
  }

  return field[0]
})
