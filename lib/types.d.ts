export type MageModule = {
  name: string;
  namespace: string;
  fqn: string;
  relativePath?: string;
  version?: string;
  enabled?: boolean;
}

export type MagePlugin = {
  module: string;
  class: string;
  name: string;
  type?: string;
  disabled?: boolean;
  sortOrder?: number;
  methods: string[];
}
