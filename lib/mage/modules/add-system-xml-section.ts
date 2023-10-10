import type { MageSystemConfig, MageNewSystemConfigSection, MageSystemConfigSection } from '~/lib/types'

export default (section: MageNewSystemConfigSection, config: MageSystemConfig): MageSystemConfig => {
  for (const [sK, existingSection] of Object.entries(config.sections)) {
    const sectionKey = Number.parseInt(sK)
    if (existingSection.id === section.id) {
      config.sections[sectionKey] = convertNewSectionToConfigSection(section)
      return config
    }
  }

  config.sections.push(convertNewSectionToConfigSection(section))

  return config
}

const convertNewSectionToConfigSection = (newSection: MageNewSystemConfigSection): MageSystemConfigSection => {
  return {
    id: newSection.id,
    label: newSection.label,
    sortOrder: newSection.sortOrder,
    showInStore: newSection.scopes.includes('store'),
    showInWebsite: newSection.scopes.includes('website'),
    showInDefault: newSection.scopes.includes('default'),
    resource: newSection.resource,
    groups: [],
  }
}
