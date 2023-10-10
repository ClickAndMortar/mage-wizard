import type { MageSystemConfig, MageNewSystemConfigGroup, MageSystemConfigGroup } from '~/lib/types'

export default (group: MageNewSystemConfigGroup, config: MageSystemConfig): MageSystemConfig => {
  for (const [sK, section] of Object.entries(config.sections)) {
    const sectionKey = Number.parseInt(sK)
    if (section.id !== group.section) continue

    for (const [gK, existingGroup] of Object.entries(section.groups)) {
      const groupKey = Number.parseInt(gK)
      if (existingGroup.id === group.id) {
        config.sections[sectionKey].groups[groupKey] = convertNewGroupToConfigGroup(group)
        return config
      }
    }

    config.sections[sectionKey].groups.push(convertNewGroupToConfigGroup(group))
  }

  return config
}

const convertNewGroupToConfigGroup = (newGroup: MageNewSystemConfigGroup): MageSystemConfigGroup => {
  return {
    id: newGroup.id,
    label: newGroup.label,
    sortOrder: newGroup.sortOrder,
    showInStore: newGroup.scopes.includes('store'),
    showInWebsite: newGroup.scopes.includes('website'),
    showInDefault: newGroup.scopes.includes('default'),
    resource: newGroup.resource,
    fields: [],
  }
}
