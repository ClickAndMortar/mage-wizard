import {MageModule, MagePlugin} from '../types';
import parser from '../php-parser-engine'
import generateComposerJson from '../generator/module-composer-json'
import generateRegistrationPhp from '../generator/module-registration-php'
import {XMLParser} from 'fast-xml-parser';
import jsonpath from 'jsonpath';
import fs from 'fs';
import useMageRoot from '~/composables/use-mage-root';
import fg from 'fast-glob';

const basePath = useMageRoot();

let allModules: MageModule[] = [];

const loadModules = (): void => {
  const modules: MageModule[] = [];

  const configPhp = fs.readFileSync(`${basePath}/app/etc/config.php`, 'utf8');
  const ast = parser.parseCode(configPhp);

  const enabledModuleNames = jsonpath.query(ast, '$.children[?(@.kind=="return")].expr.items[?(@.key.value=="modules")].value.items[?(@.value.value=="1")].key.value');

  const moduleXmlFiles = fg.sync([
    basePath + '/app/code/**/etc/module.xml',
    basePath + '/vendor/**/etc/module.xml',
  ], {
    ignore: ['**/dev/tests/**']
  });
  for (const moduleXmlFile of moduleXmlFiles) {
    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const moduleXml = parser.parse(fs.readFileSync(moduleXmlFile, 'utf8'));
    if (moduleXml.config?.module) {
      const module: MageModule = {
        name: moduleXml.config.module['@_name'].split('_')[1],
        namespace: moduleXml.config.module['@_name'].split('_')[0],
        fqn: moduleXml.config.module['@_name'],
        relativePath: moduleXmlFile.replace(`${basePath}/`, '').replace('/etc/module.xml', ''),
        enabled: enabledModuleNames.includes(moduleXml.config.module['@_name']),
      }

      const composerJsonPath = `${basePath}/${module.relativePath}/composer.json`;

      if (fs.existsSync(composerJsonPath)) {
        const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, 'utf8'));
        module.version = composerJson.version;
      }

      modules.push(module);
    }
  }

  allModules = modules;
}

const getModules = (refresh: boolean = false): MageModule[] => {
  if (allModules.length === 0 || refresh) {
    loadModules();
  }

  return allModules;
}

const moduleExists = (module: MageModule): boolean => {
  return allModules.some((m: MageModule) => {
    return m.name === module.name && m.namespace === module.namespace;
  });
}

const createModule = (module: MageModule): void => {
  if (moduleExists(module)) {
    throw new Error('Module already exists');
  }

  const namespace = module.namespace
  const name = module.name

  const modulePath = `${basePath}/app/code/${namespace}/${name}`;
  fs.mkdirSync(modulePath, { recursive: true });
  fs.mkdirSync(`${modulePath}/etc`, { recursive: true });
  fs.writeFileSync(`${modulePath}/composer.json`, generateComposerJson(namespace, name));
  fs.writeFileSync(`${modulePath}/registration.php`, generateRegistrationPhp(namespace, name));
}

const getDiXml = (module: MageModule): any => {
  const path = `${basePath}/${module.relativePath}/etc/di.xml`;
  if (!fs.existsSync(path)) {
    return {};
  }

  const arrays = ['type', 'virtualType', 'preference', 'arguments', 'plugin'];

  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name, jpath, isLeafNode, isAttribute) => {
      return arrays.includes(name) && !isAttribute;
    },
  });

  return parser.parse(fs.readFileSync(path, 'utf8'));
}

const getFilePath = (module: MageModule, classFqn: string): string => {
  return `${basePath}/${module.relativePath}/${classFqn.split('\\').slice(2).join('/')}.php`;
}

const getPlugins = (namespaces: string[]): MagePlugin[] => {
  const modules = getModules();
  const plugins: MagePlugin[] = [];

  modules.forEach((module: MageModule) => {
    if (namespaces.includes(module.namespace)) {
      const diXml = getDiXml(module);
      if (!diXml.config || !diXml.config.type) {
        return;
      }

      const types = diXml.config.type;
      for (const type of types) {
        if (type.plugin) {
          for (const plugin of type.plugin) {
            const magePlugin: MagePlugin = {
              module: module.fqn,
              class: type['@_name'],
              name: plugin['@_name'],
              type: plugin['@_type'],
              disabled: plugin['@_disabled'] === 'true',
              sortOrder: parseInt(plugin['@_sortOrder'] || '0'),
              methods: [],
            }

            if (magePlugin.type) {
              const pluginPath = getFilePath(module, plugin['@_type']);
              if (fs.existsSync(pluginPath)) {
                const pluginAst = parser.parseCode(fs.readFileSync(pluginPath, 'utf8'));
                const pluginMethods: string[] = jsonpath.query(pluginAst, '$.children[?(@.kind=="namespace")].children[?(@.kind=="class")].body[?(@.kind=="method")].name.name');
                // Add pluginMethods starting with before, after or around to methods in magePlugin
                for (const pluginMethod of pluginMethods) {
                  if (pluginMethod.startsWith('before') || pluginMethod.startsWith('after') || pluginMethod.startsWith('around')) {
                    magePlugin.methods.push(pluginMethod);
                  }
                }
              }
            }

            plugins.push(magePlugin);
          }
        }
      }
    }
  })

  return plugins;
}

export {
  getModules,
  moduleExists,
  createModule,
  getDiXml,
  getPlugins,
  getFilePath,
};
