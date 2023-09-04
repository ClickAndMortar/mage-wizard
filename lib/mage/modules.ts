import {
  MageCommand,
  MageDiXmlConfig,
  MageDiXmlType,
  MageDiXmlTypeArgument, MageDiXmlTypeArgumentItem,
  MageDiXmlTypePlugin, MageDiXmlVirtualType,
  MageModule, MageNewCommand,
  MagePlugin
} from '../types';
import parser from '../php-parser-engine'
import generateComposerJson from '../generator/module-composer-json'
import generateRegistrationPhp from '../generator/module-registration-php'
import generateModuleXml from '../generator/module-module-xml'
import generateCommand from '../generator/module-command'
import {XMLBuilder, XMLParser} from 'fast-xml-parser';
import jsonpath from 'jsonpath';
import fs from 'fs';
import useMageRoot from '~/composables/use-mage-root';
import fg from 'fast-glob';

const basePath = useMageRoot();

let allModules: MageModule[] = [];

export const loadModules = (): void => {
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
        core: moduleXmlFile.includes('/vendor/magento/'),
        vendor: moduleXmlFile.includes('/vendor/'),
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

export const getModules = (refresh: boolean = false): MageModule[] => {
  if (allModules.length === 0 || refresh) {
    loadModules();
  }

  return allModules;
}

export const moduleExists = (module: MageModule): boolean => {
  return allModules.some((m: MageModule) => {
    return m.name === module.name && m.namespace === module.namespace;
  });
}

export const createModule = (module: MageModule): void => {
  if (moduleExists(module)) {
    throw new Error('Module already exists');
  }

  const namespace = module.namespace
  const name = module.name
  if (!module.fqn) {
    module.fqn = `${namespace}_${name}`;
  }

  const modulePath = `${basePath}/app/code/${namespace}/${name}`;
  fs.mkdirSync(modulePath, {recursive: true});
  fs.mkdirSync(`${modulePath}/etc`, {recursive: true});
  fs.writeFileSync(`${modulePath}/composer.json`, generateComposerJson(module));
  fs.writeFileSync(`${modulePath}/registration.php`, generateRegistrationPhp(module));
  fs.writeFileSync(`${modulePath}/etc/module.xml`, generateModuleXml(module));

  loadModules();
}

export const createCommand = (command: MageNewCommand): void => {
  const module = getModule(command.module);
  const modulePath = `${basePath}/${module.relativePath}`;

  const commandClassName = command.name.split(':').map((part: string) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');

  command.class = commandClassName;

  fs.mkdirSync(`${modulePath}/Console/Command`, {recursive: true});
  fs.writeFileSync(`${modulePath}/Console/Command/${commandClassName}.php`, generateCommand(module, command));

  const diXmlPath = `${modulePath}/etc/di.xml`;
  const diXml = getDiXml(module);

  let commandListType: MageDiXmlType | undefined;
  let commandListIdx: number | undefined;
  for (const [idx, type] of (diXml.types || []).entries()) {
    if (type.name.includes('CommandList')) {
      commandListType = type;
      commandListIdx = idx;
      break;
    }
  }

  if (!diXml.types) {
    diXml.types = [];
  }

  const argumentItem: MageDiXmlTypeArgumentItem = {
    name: command.name,
    type: 'object',
    value: `${getModulePhpNamespace(module)}\\Console\\Command\\${commandClassName}`,
  }

  if (!commandListType) {
    commandListType = {
      name: `Magento\\Framework\\Console\\CommandListInterface`,
      arguments: [],
    }

    diXml.types.push(commandListType);
  }

  if (!commandListType.arguments || commandListType.arguments.length === 0) {
    commandListType.arguments = [];

    commandListType.arguments.push({
      name: 'commands',
      type: 'array',
    })
  }

  for (const [idx, argument] of commandListType.arguments.entries()) {
    if (argument.name === 'commands') {
      if (!argument.values) {
        argument.values = [];
      }

      if (argument.values.some((value: MageDiXmlTypeArgumentItem) => {
        return value.name === argumentItem.name;
      })) {
        throw new Error(`Command ${argumentItem.name} already exists`);
      }

      argument.values.push(argumentItem);

      commandListType.arguments[idx] = argument;
    }
  }

  if (commandListIdx !== undefined) {
    diXml.types[commandListIdx] = commandListType;
  } else {
    diXml.types.push(commandListType);
  }

  console.log(JSON.stringify(diXml, null, 2));

  fs.writeFileSync(diXmlPath, generateDiXml(diXml));
}

export const generateDiXml = (diXml: MageDiXmlConfig): string => {
  const diXmlObject: any = {
    '?xml': { '@_version': '1.0' },
    config: {
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xsi:noNamespaceSchemaLocation': 'urn:magento:framework:ObjectManager/etc/config.xsd'
    }
  };

  // Preferences
  if (diXml.preferences && diXml.preferences.length > 0) {
    diXmlObject.config.preference = [];

    for (const preference of diXml.preferences) {
      diXmlObject.config.preference.push({
        '@_for': preference.for,
        '@_type': preference.type,
      });
    }
  }

  // Types
  if (diXml.types && diXml.types.length > 0) {
    diXmlObject.config.type = [];
  }

  for (const type of diXml.types || []) {
    const typeObject: any = {
      '@_name': type.name,
    }

    if (type.shared) {
      typeObject['@_shared'] = type.shared ? 'true' : 'false';
    }

    if (type.arguments && type.arguments.length > 0) {
      typeObject.arguments = {
        argument: [],
      }
    }

    for (const argument of type.arguments || []) {
      const argumentObject: any = {
        '@_name': argument.name,
        '@_xsi:type': argument.type,
      }

      if (argument.type === 'array' && argument.values) {
        argumentObject.item = []

        for (const value of argument.values) {
          argumentObject.item.push({
            '@_name': value.name,
            '@_xsi:type': value.type,
            '#text': value.value,
          });
        }
      } else {
        argumentObject['#text'] = argument.value
      }

      typeObject.arguments.argument.push(argumentObject);
    }

    if (type.plugins && type.plugins.length > 0) {
      typeObject.plugin = [];

      for (const plugin of type.plugins) {
        const pluginObject: any = {
          '@_name': plugin.name,
          '@_type': plugin.type,
        }

        if (plugin.sortOrder) {
          pluginObject['@_sortOrder'] = plugin.sortOrder;
        }

        if (plugin.disabled) {
          pluginObject['@_disabled'] = plugin.disabled ? 'true' : 'false';
        }

        typeObject.plugin.push(pluginObject);
      }
    }

    diXmlObject.config.type.push(typeObject);
  }

  // Virtual Types
  if (diXml.virtualTypes && diXml.virtualTypes.length > 0) {
    diXmlObject.config.virtualType = [];
  }

  for (const virtualType of diXml.virtualTypes || []) {
    const virtualTypeObject: any = {
      '@_name': virtualType.name,
      '@_type': virtualType.type,
    }

    if (virtualType.shared) {
      virtualTypeObject['@_shared'] = virtualType.shared ? 'true' : 'false';
    }

    if (virtualType.arguments && virtualType.arguments.length > 0) {
      virtualTypeObject.arguments = {
        argument: [],
      }
    }

    for (const argument of virtualType.arguments || []) {
      const argumentObject: any = {
        '@_name': argument.name,
        '@_xsi:type': argument.type,
      }

      if (argument.type === 'array' && argument.values) {
        argumentObject.item = []

        for (const value of argument.values) {
          argumentObject.item.push({
            '@_name': value.name,
            '@_xsi:type': value.type,
            '#text': value.value,
          });
        }
      } else {
        argumentObject['#text'] = argument.value
      }

      virtualTypeObject.arguments.argument.push(argumentObject);
    }

    diXmlObject.config.virtualType.push(virtualTypeObject);
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  });

  return builder.build(diXmlObject);
}

export const getModulePhpNamespace = (module: MageModule): string => {
  return module.fqn.replace('_', '\\');
}

export const getDiXml = (module: MageModule): MageDiXmlConfig => {
  const config: MageDiXmlConfig = {
    types: [],
    preferences: [],
    virtualTypes: [],
  }

  const path = `${basePath}/${module.relativePath}/etc/di.xml`;
  if (!fs.existsSync(path)) {
    return config
  }

  const arrays = ['type', 'virtualType', 'preference', 'plugin', 'item', 'argument'];

  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name, jpath, isLeafNode, isAttribute) => {
      return arrays.includes(name) && !isAttribute;
    },
  });

  const parsed = parser.parse(fs.readFileSync(path, 'utf8'));

  if (!parsed.config) {
    return config;
  }

  if (parsed.config.preference) {
    config.preferences = [];

    for (const preference of parsed.config.preference) {
      config.preferences.push({
        for: preference['@_for'],
        type: preference['@_type'],
      });
    }
  }

  if (parsed.config.type) {
    config.types = []

    for (const type of parsed.config.type) {
      const mageType: MageDiXmlType = {
        name: type['@_name'],
        arguments: [],
        plugins: [],
      }

      if (type['@_shared']) {
        mageType.shared = type['@_shared'] === 'true';
      }

      if (type.arguments?.argument) {
        mageType.arguments = [];

        for (const argument of type.arguments.argument) {
          const mageArgument: MageDiXmlTypeArgument = {
            name: argument['@_name'],
            type: argument['@_xsi:type'],
          }

          if (argument['#text']) {
            mageArgument.value = argument['#text'];
          }

          if (argument.item) {
            mageArgument.values = [];
            for (const item of argument.item) {
              mageArgument.values.push({
                name: item['@_name'],
                type: item['@_xsi:type'],
                value: item['#text'],
              });
            }
          }

          mageType.arguments.push(mageArgument);
        }
      }

      if (type.plugin) {
        mageType.plugins = [];

        for (const plugin of type.plugin) {
          const magePlugin: MageDiXmlTypePlugin = {
            name: plugin['@_name'],
            type: plugin['@_type'],
          }

          if (plugin['@_sortOrder']) {
            magePlugin.sortOrder = parseInt(plugin['@_sortOrder']);
          }

          if (plugin['@_disabled']) {
            magePlugin.disabled = plugin['@_disabled'] === 'true';
          }

          mageType.plugins.push(magePlugin);
        }
      }

      config.types.push(mageType);
    }
  }

  if (parsed.config.virtualType) {
    config.virtualTypes = []

    for (const virtualType of parsed.config.virtualType) {
      const mageVirtualType: MageDiXmlVirtualType = {
        name: virtualType['@_name'],
        type: virtualType['@_type'],
        arguments: [],
        plugins: [],
      }

      if (virtualType['@_shared']) {
        mageVirtualType.shared = virtualType['@_shared'] === 'true';
      }

      if (virtualType.arguments?.argument) {
        mageVirtualType.arguments = [];

        for (const argument of virtualType.arguments.argument) {
          const mageArgument: MageDiXmlTypeArgument = {
            name: argument['@_name'],
            type: argument['@_xsi:type'],
          }

          if (argument['#text']) {
            mageArgument.value = argument['#text'];
          }

          if (argument.item) {
            mageArgument.values = [];
            for (const item of argument.item) {
              mageArgument.values.push({
                name: item['@_name'],
                type: item['@_xsi:type'],
                value: item['#text'],
              });
            }
          }

          mageVirtualType.arguments.push(mageArgument);
        }
      }

      config.virtualTypes.push(mageVirtualType);
    }
  }

  return config;
}

export const getClassFilePath = (module: MageModule, classFqn: string): string => {
  return `${basePath}/${module.relativePath}/${classFqn.split('\\').slice(2).join('/')}.php`;
}

export const getNamespaces = (): string[] => {
  const namespaces: string[] = [];
  for (const module of getModules()) {
    if (!namespaces.includes(module.namespace)) {
      namespaces.push(module.namespace);
    }
  }
  return namespaces;
}

export const getModule = (name: string): MageModule => {
  const modules = getModules();
  for (const module of modules) {
    if (module.fqn === name) {
      return module;
    }
  }

  throw new Error(`Module ${name} not found`);
}


export const getCommands = (namespaces: string[] = []): MageCommand[] => {
  const modules = getModules();
  const commands: MageCommand[] = [];

  if (namespaces.length === 0) {
    namespaces = getNamespaces();
  }

  modules.forEach((module: MageModule) => {
    if (namespaces.includes(module.namespace)) {
      const diXml = getDiXml(module);

      for (const type of diXml.types || []) {
        if (!type.name.includes('CommandList')) {
          continue;
        }

        for (const arg of type.arguments || []) {
          if (arg.name === 'commands' && arg.values) {
            for (const value of arg.values) {
              const command: MageCommand = {
                module: module,
                name: value.name,
                class: value.value,
                command: '',
              }

              const commandPath = getClassFilePath(module, command.class);
              if (fs.existsSync(commandPath)) {
                const commandAst = parser.parseCode(fs.readFileSync(commandPath, 'utf8'));
                const commands = jsonpath.query(commandAst, '$..body[?(@.kind=="method" && @.name.name=="configure")].body.children[?(@.kind=="expressionstatement" && @.expression.what.offset.name == "setName")].expression.arguments.*.value');
                if (commands.length > 0) {
                  command.command = commands[0];
                }

                // if (command.command === '') {
                //   const altCommands = jsonpath.query(commandAst, '$..[?(@.kind=="method" && @.name.name=="configure")]..what[?(@.what.what.offset.name=="setName")].what.arguments.*.value');
                //   console.log(altCommands);
                //   if (altCommands.length > 0) {
                //     command.command = altCommands[0];
                //   }
                // }
              }

              commands.push(command);
            }
          }
        }
      }
    }
  })

  return commands;
}

export const getPlugins = (namespaces: string[] = []): MagePlugin[] => {
  const modules = getModules();
  const plugins: MagePlugin[] = [];

  if (namespaces.length === 0) {
    namespaces = getNamespaces();
  }

  modules.forEach((module: MageModule) => {
    if (namespaces.includes(module.namespace)) {
      const diXml = getDiXml(module);

      for (const type of diXml.types || []) {
        for (const plugin of type.plugins || []) {
          const magePlugin: MagePlugin = {
            module: module,
            class: type.name,
            name: plugin.name,
            type: plugin.type,
            disabled: plugin.disabled,
            sortOrder: plugin.sortOrder,
            methods: [],
            diXmlPath: `${basePath}/${module.relativePath}/etc/di.xml`,
            diXmlLine: 0, // TODO
          }

          const diXmlContent = fs.readFileSync(magePlugin.diXmlPath, 'utf8');
          const diXmlLines = diXmlContent.split('\n');
          for (let i = 0; i < diXmlLines.length; i++) {
            const line = diXmlLines[i];
            if (line.includes(`name="${magePlugin.name}"`)) {
              magePlugin.diXmlLine = i + 1;
              break;
            }
          }

          if (magePlugin.type) {
            const pluginPath = getClassFilePath(module, plugin.type);
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
  })

  return plugins;
}
