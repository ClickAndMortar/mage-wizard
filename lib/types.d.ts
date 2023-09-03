export type MageModule = {
  name: string;
  namespace: string;
  fqn: string;
  relativePath?: string;
  version?: string;
  enabled?: boolean;
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
  arguments: MageDiXmlTypeArgument[];
  plugins: MageDiXmlTypePlugin[];
}

export type MageDiXmlVirtualType = MageDiXmlType & {
  type: string;
}

export type MageDiXmlConfig = {
  types: MageDiXmlType[];
  virtualTypes: MageDiXmlVirtualType[];
  preferences: MageDiXmlPreference[];
}
