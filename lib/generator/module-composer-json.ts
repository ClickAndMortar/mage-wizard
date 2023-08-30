export default function (namespace: string, module: string): string {
  const psr4Prefix = `${namespace}\\${module}\\`;

  const json: any = {
    name: `${namespace.toLowerCase()}/module-${module.toLowerCase()}`,
    version: "100.0.0",
    require: {
      php: ">=7.3",
      "magento/magento-composer-installer": "*"
    },
    suggest: {},
    type: "magento2-module",
    license: "proprietary",
    autoload: {
      files: [
        "registration.php"
      ],
      "psr-4": {
        [psr4Prefix]: ""
      }
    }
  }

  return JSON.stringify(json, null, 4)
}
