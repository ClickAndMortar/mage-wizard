import type { MageSystemConfig, MageNewSystemConfigField, MageSystemConfigField } from '~/lib/types'

export default (field: MageNewSystemConfigField, config: MageSystemConfig): MageSystemConfig => {
  let fieldFound = false

  for (const [sK, section] of Object.entries(config.sections)) {
    const sectionKey = Number.parseInt(sK)
    if (section.id !== field.section) continue

    for (const [gK, group] of Object.entries(section.groups)) {
      const groupKey = Number.parseInt(gK)
      if (group.id !== field.group) continue

      for (const [fK, existingField] of Object.entries(group.fields)) {
        const fieldKey = Number.parseInt(fK)

        if (existingField.id === field.id) {
          fieldFound = true
          config.sections[sectionKey].groups[groupKey].fields[fieldKey] = convertNewFieldToConfigField(field)
          return config
        }
      }

      if (!fieldFound) {
        config.sections[sectionKey].groups[groupKey].fields.push(convertNewFieldToConfigField(field))
        return config
      }
    }
  }

  return config
}

const convertNewFieldToConfigField = (newField: MageNewSystemConfigField): MageSystemConfigField => {
  return {
    id: newField.id,
    label: newField.label,
    path: `${newField.section}/${newField.group}/${newField.id}`,
    type: newField.type,
    comment: newField.comment,
    sortOrder: newField.sortOrder,
    showInStore: newField.scopes.includes('stores'),
    showInWebsite: newField.scopes.includes('websites'),
    showInDefault: newField.scopes.includes('default'),
    validate: newField.validators.length > 0 ? newField.validators.join(' ') : undefined,
    sourceModel: newField.sourceModel,
    backendModel: newField.backendModel,
    frontendClass: newField.frontendClass,
    frontendModel: newField.frontendModel,
    tooltip: newField.tooltip,
    resource: newField.resource,
    advanced: newField.advanced,
    canRestore: newField.canRestore,
    extends: newField.extends,
    translate: newField.translate,
  }
}
