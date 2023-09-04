import { getCommands } from '~/lib/mage/modules'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  if (query.namespaces) {
    // @ts-ignore
    return getCommands(query.namespaces?.split(',') || [])
  }

  if (query.module) {
    // @ts-ignore
    return getCommands([]).filter((command) => command.module.fqn === query.module)
  }

  return getCommands([])
})
