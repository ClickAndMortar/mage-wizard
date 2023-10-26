export type MageModule = {
  name: string;
  namespace: string;
  fqn: string;
  relativePath?: string;
  version?: string;
  enabled?: boolean;
  core: boolean;
  vendor: boolean;
  dependencies?: string[];
}

export type MageNewModule = Omit<MageModule, 'fqn' | 'relativePath' | 'enabled' | 'core' | 'vendor'> & {
  fqn?: string;
}

export type MagePlugin = {
  module: MageModule;
  class: string;
  name: string;
  type?: string;
  disabled?: boolean;
  sortOrder?: number;
  methods: string[];
  diXmlPath: string;
  diXmlLine: number;
}

export type MageSystemConfigTab = {
  id: string;
  label?: string;
  translate?: string;
  sortOrder?: number;
  class?: string;
  // TODO: handle file path (many system.xml files possible)
}

export type MageSystemConfigSection = {
  id: string;
  label?: string;
  tab?: string;
  sortOrder?: number;
  showInDefault?: boolean;
  showInWebsite?: boolean;
  showInStore?: boolean;
  extends?: string;
  canRestore?: string;
  type?: string;
  advanced?: boolean;
  translate?: string;
  resource?: string;
  groups: MageSystemConfigGroup[];
  // TODO: handle file path (many system.xml files possible)
}

export type MageNewSystemConfigSection = Omit<MageSystemConfigSection, 'groups' | 'showInWebsite' | 'showInStore' | 'showInDefault'> & {
  scopes: string[];
}

export type MageSystemConfigGroup = {
  id: string;
  label?: string;
  translate?: string;
  sortOrder?: number;
  showInDefault?: boolean;
  showInWebsite?: boolean;
  showInStore?: boolean;
  extends?: string;
  canRestore?: string;
  type?: string;
  advanced?: boolean;
  resource?: string;
  // TODO: many more options as child attributes + handle file path (many system.xml files possible)
  fields: MageSystemConfigField[];
}

export type MageNewSystemConfigGroup = Omit<MageSystemConfigGroup, 'fields' | 'showInWebsite' | 'showInStore' | 'showInDefault'> & {
  section: string;
  scopes: string[];
}

export type MageSystemConfigField = {
  id: string;
  label?: string;
  translate?: string;
  sortOrder?: number;
  showInDefault?: boolean;
  showInWebsite?: boolean;
  showInStore?: boolean;
  extends?: string;
  canRestore?: string;
  advanced?: boolean;
  type?: string;
  comment?: string;
  frontendModel?: string;
  frontendClass?: string;
  backendModel?: string;
  sourceModel?: string;
  tooltip?: string;
  validate?: string;
  resource?: string;
  path: string; // Path to the config value Magento style, ie. 'general/store_information/name'
  default?: string;
  // TODO: many more options as child attributes + handle file path (many system.xml files possible)
}

export type MageSystemConfig = {
  module: MageModule;
  tabs: MageSystemConfigTab[];
  sections: MageSystemConfigSection[];
}

export type MageNewSystemConfigField = Omit<MageSystemConfigField, 'path' | 'validate' | 'showInWebsite' | 'showInStore' | 'showInDefault'> & {
  module: string;
  group: string;
  section: string;
  validators: string[];
  scopes: string[];
}

export type MageCommand = {
  module: MageModule;
  class: string;
  name: string;
  command: string;
}

export type MageNewCommand = {
  name: string;
  description: string;
  module: string;
  injects: string[];
  class?: string;
}

export type MagePatchType = 'data'|'schema';

export type MageNewPatch = {
  name: string;
  className?: string;
  type: MagePatchType;
}

// export type MageNewCommand = Omit<'module', MageCommand>

export type MageDiXmlTypeArgumentItem = {
  name: string;
  type: string;
  value: string;
}

export type MageDiXmlTypeArgument = {
  name: string;
  type: string;
  value?: string;
  values?: MageDiXmlTypeArgumentItem[];
}

export type MageDiXmlTypePlugin = {
  name: string;
  type: string;
  sortOrder?: number;
  disabled?: boolean;
}

export type MageDiXmlType = {
  name: string;
  shared?: boolean;
  arguments?: MageDiXmlTypeArgument[];
  plugins?: MageDiXmlTypePlugin[];
}

export type MageDiXmlVirtualType = MageDiXmlType & {
  type: string;
}

export type MageDiXmlConfig = {
  types?: MageDiXmlType[];
  virtualTypes?: MageDiXmlVirtualType[];
  preferences?: MageDiXmlPreference[];
}

export type MageConfigXmlFieldScope = {
  [key: string]: string;
}

export type MageConfigXmlGroupScope = {
  [key: string]: MageConfigXmlFieldScope;
}

export type MageConfigXmlSectionScope = {
  [key: string]: MageConfigXmlGroupScope;
}

export type MageConfigXml = {
  default: MageConfigXmlSectionScope;
}

export type Notification = {
  title?: string;
  message: string;
  type?: NotificationType;
  duration?: number;
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type MageWizardSettings = {
  version: string;
  path: string;
  phpVersion: string;
}

export type MageVersion = {
  version: string;
  eol: Date;
}

export type MageCrontabXmlJob = {
  group: string;
  name: string;
  instance: string;
  method: string;
  schedule?: string;
  configPath?: string;
}

export type MageCrontabXml = {
  jobs: MageCrontabXmlJob[];
}

export type MageCrontabGroup = {
  name: string;
  jobCount: number;
}

export type MageCronGroupXmlGroup = {
  id: string;
  scheduleGenerateEvery?: number;
  scheduleAheadFor?: number;
  scheduleLifetime?: number;
  historyCleanupEvery?: number;
  historySuccessLifetime?: number;
  historyFailureLifetime?: number;
  useSeparateProcess?: number;
}

export type MageCronGroupXml = {
  groups: MageCronGroupXmlGroup[];
}
