import { XMLBuilder } from 'fast-xml-parser'
import type { MageSystemConfig } from '~/lib/types'
import boolToZeroOne from '~/lib/utils/bool-to-zero-one'

export default (config: MageSystemConfig): string => {
  const systemXmlObject: any = {
    '?xml': { '@_version': '1.0' },
    config: {
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xsi:noNamespaceSchemaLocation': 'urn:magento:module:Magento_Config:etc/system_file.xsd',
      system: {},
    },
  }

  if (config.tabs && config.tabs.length > 0) {
    systemXmlObject.config.system.tab = []

    for (const tab of config.tabs) {
      systemXmlObject.config.system.tab.push({
        '@_id': tab.id,
        '@_translate': tab.translate,
        '@_sortOrder': tab.sortOrder,
        label: tab.label,
      })
    }
  }

  if (config.sections && config.sections.length > 0) {
    systemXmlObject.config.system.section = []
  }

  for (const section of config.sections || []) {
    const sectionObject: any = {
      '@_id': section.id,
      '@_translate': section.translate,
      '@_sortOrder': section.sortOrder,
      '@_showInDefault': section.showInDefault === undefined ? undefined : boolToZeroOne(section.showInDefault),
      '@_showInWebsite': section.showInWebsite === undefined ? undefined : boolToZeroOne(section.showInWebsite),
      '@_showInStore': section.showInStore === undefined ? undefined : boolToZeroOne(section.showInStore),
      label: section.label || undefined,
      tab: section.tab,
      resource: section.resource || undefined,
      group: [],
    }

    if (section.groups && section.groups.length > 0) {
      for (const group of section.groups) {
        const groupObject: any = {
          '@_id': group.id,
          '@_translate': group.translate,
          '@_sortOrder': group.sortOrder,
          '@_showInDefault': group.showInDefault === undefined ? undefined : boolToZeroOne(group.showInDefault),
          '@_showInWebsite': group.showInWebsite === undefined ? undefined : boolToZeroOne(group.showInWebsite),
          '@_showInStore': group.showInStore === undefined ? undefined : boolToZeroOne(group.showInStore),
          label: group.label || undefined,
          resource: group.resource || undefined,
          field: [],
        }

        if (group.fields && group.fields.length > 0) {
          for (const field of group.fields) {
            const fieldObject: any = {
              '@_id': field.id,
              '@_translate': field.translate || undefined,
              '@_type': field.type,
              '@_sortOrder': field.sortOrder,
              '@_showInDefault': field.showInDefault === undefined ? undefined : boolToZeroOne(field.showInDefault),
              '@_showInWebsite': field.showInWebsite === undefined ? undefined : boolToZeroOne(field.showInWebsite),
              '@_showInStore': field.showInStore === undefined ? undefined : boolToZeroOne(field.showInStore),
              label: field.label || undefined,
              resource: field.resource || undefined,
              comment: field.comment === undefined ? undefined : wrapInCdataIfNeeded(field.comment),
              frontend_model: field.frontendModel || undefined,
              frontend_class: field.frontendClass || undefined,
              backend_model: field.backendModel || undefined,
              source_model: field.sourceModel || undefined,
              tooltip: field.tooltip || undefined,
              validate: field.validate || undefined,
            }

            groupObject.field.push(fieldObject)
          }
        }

        sectionObject.group.push(groupObject)
      }
    }

    systemXmlObject.config.system.section.push(sectionObject)
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    indentBy: '    ',
  })

  return builder.build(systemXmlObject)
}

const wrapInCdataIfNeeded = (input: string): string => {
  // TODO: fix this as CDATA tags are incorrectly escaped when written to file
  return input

  if (input.includes('<') || input.includes('>')) {
    return `<![CDATA[${input}]]>`
  }

  return input
}
