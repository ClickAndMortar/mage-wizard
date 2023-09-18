export type PhpVisibility = 'public' | 'protected' | 'private'

export interface PhpMethodArgument {
  name: string
  type?: string
  nullable?: boolean
  readonly?: boolean
  value?: any
  visibility?: PhpVisibility
  byReference?: boolean
}

export interface PhpClassProperty {
  name: string
  type?: string
  nullable?: boolean
  readonly?: boolean
  value?: any
  visibility: PhpVisibility
  static?: boolean
}

export interface PhpClassConstant {
  name: string
  // type?: string
  visibility: PhpVisibility
  value: any
}

export type PhpClassMethodType = 'static' | 'abstract' | 'final'
export type PhpClassMethodReturnType = 'void' | 'string' | 'int' | 'float' | 'bool' | 'array' | 'object' | 'mixed' | 'self' | 'static' | 'parent' | 'never' | string

export interface PhpClassMethod {
  getName(): string
  addArgument(argument: PhpMethodArgument): void
  getArguments(): PhpMethodArgument[]
  getVisibility(): PhpVisibility
  getType(): PhpClassMethodType | undefined
  getReturnType(): PhpClassMethodReturnType | undefined
  setBody(body: string): void
  getBody(): string
}

export interface PhpProgram {
  setNamespace(namespace: string): void
  getNamespace(): string
  addDeclare(name: string, value: string): void
  getDeclares(): Map<string, string>
  addUse(name: string, alias?: string): void
  getUses(): Map<string, string>
  addClass(phpClass: PhpClass): void
  getClasses(): PhpClass[]
}

export interface PhpClass {
  getName(): string
  getExtend(): string | undefined
  getImplement(): string[]
  getMethods(): PhpClassMethod[]
  addMethod(method: PhpClassMethod): void
  getProperties(): PhpClassProperty[]
  addProperty(property: PhpClassProperty): void
  getConstants(): PhpClassConstant[]
  addConstant(constant: PhpClassConstant): void
}
