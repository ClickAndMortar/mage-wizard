import {getPlugins} from '~/lib/mage/modules';

export default defineEventHandler((event) => {
  const query = getQuery(event)
  if (query.namespaces) {
    // @ts-ignore
    return getPlugins(query.namespaces?.split(',') || [])
  }

  if (query.module) {
    // @ts-ignore
    return getPlugins([]).filter((plugin) => plugin.module.fqn === query.module)
  }

  return getPlugins([])
})
