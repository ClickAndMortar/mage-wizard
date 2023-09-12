import type { MageNewSystemConfigField, MageConfigXml } from '~/lib/types'

// TODO: handle scopes other than default
export default (field: MageNewSystemConfigField, config: MageConfigXml): MageConfigXml => {
  if (field.default === undefined) {
    return config
  }

  if (!config.default[field.section]) {
    config.default[field.section] = {}
  }

  if (!config.default[field.section][field.group]) {
    config.default[field.section][field.group] = {}
  }

  config.default[field.section][field.group][field.id] = field.default

  return config
}
