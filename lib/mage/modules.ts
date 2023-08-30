import {MageModule, MagePlugin} from '../types';
const jsonpath = require('jsonpath');
const fs = require('fs');
import parser from '../php-parser-engine'
import generateComposerJson from '../generator/module-composer-json'
import generateRegistrationPhp from '../generator/module-registration-php'
import {XMLParser} from 'fast-xml-parser';

const basePath = useMageRoot();

const getModules = (): MageModule[] => {
  const configPhp = fs.readFileSync(`${basePath}/etc/config.php`, 'utf8');
  const ast = parser.parseCode(configPhp);

  const moduleNames = jsonpath.query(ast, '$.children[?(@.kind=="return")].expr.items[?(@.key.value=="modules")].value.items[?(@.value.value=="1")].key.value');

  const modules: MageModule[] = [];

  for (const moduleName of moduleNames) {
    const namespace = moduleName.split('_')[0];
    const module = moduleName.split('_')[1];
    const relativePath = `code/${namespace}/${module}`;
    const composerJsonPath = `${basePath}/${relativePath}/composer.json`;
    const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, 'utf8'));
    const version = composerJson.version;
    modules.push({
      name: moduleName,
      namespace: namespace,
      fqn: `${namespace}_${module}`,
      relativePath: relativePath,
      version: version,
    });
  }

  return modules;
}

const getModulePath = (module: MageModule): string => {
  // TODO: handle vendor modules
  return `${basePath}/code/${module.fqn.replace('_', '/')}`;
}

const moduleExists = (module: MageModule): boolean => {
  return fs.existsSync(getModulePath(module));
}

const createModule = (module: MageModule): void => {
  if (moduleExists(module)) {
    throw new Error('Module already exists');
  }

  const namespace = module.namespace
  const name = module.name

  const modulePath = `${basePath}/code/${namespace}/${name}`;
  fs.mkdirSync(modulePath, { recursive: true });
  fs.mkdirSync(`${modulePath}/etc`, { recursive: true });
  fs.writeFileSync(`${modulePath}/composer.json`, generateComposerJson(namespace, name));
  fs.writeFileSync(`${modulePath}/registration.php`, generateRegistrationPhp(namespace, name));
}

const getDiXml = (module: MageModule): any => {
  const path = `${getModulePath(module)}/etc/di.xml`;
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
  return `${getModulePath(module)}/${classFqn.split('\\').slice(2).join('/')}.php`;
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
  getModulePath,
  moduleExists,
  createModule,
  getDiXml,
  getPlugins,
  getFilePath,
};
