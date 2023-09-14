import type { MageModule, MageNewModule } from '~/lib/types'

export default function (module: MageModule | MageNewModule): string {
  const psr4Prefix = `${module.namespace}\\${module.name}\\`

  const snakeModuleName = module.name.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()

  const json: any = {
    name: `${module.namespace.toLowerCase()}/module-${snakeModuleName}`,
    version: module.version || '0.0.1',
    require: {
      php: '>=7.3',
      'magento/magento-composer-installer': '*',
    },
    suggest: {},
    type: 'magento2-module',
    license: 'proprietary',
    autoload: {
      files: ['registration.php'],
      'psr-4': {
        [psr4Prefix]: '',
      },
    },
  }

  return JSON.stringify(json, null, 4)
}
