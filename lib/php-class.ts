import type { PhpClass, PhpClassConstant, PhpClassProperty, PhpClassMethod } from '~/lib/generator/php/types'

export default class implements PhpClass {
  private readonly name: string
  private readonly extend?: string
  private readonly implement: string[]
  private constants: Map<string, PhpClassConstant> = new Map()
  private properties: Map<string, PhpClassProperty> = new Map()
  private methods: Map<string, PhpClassMethod> = new Map()

  constructor(name: string, extend?: string | undefined, implement?: string[]) {
    this.name = name
    this.extend = extend
    this.implement = implement ?? []
  }

  getName(): string {
    return this.name
  }

  getConstants(): PhpClassConstant[] {
    return [...this.constants.values()]
  }

  addConstant(constant: PhpClassConstant): void {
    this.constants.set(constant.name, constant)
  }

  getProperties(): PhpClassProperty[] {
    return [...this.properties.values()]
  }

  addProperty(property: PhpClassProperty): void {
    this.properties.set(property.name, property)
  }

  getExtend(): string | undefined {
    return this.extend
  }

  getImplement(): string[] {
    return this.implement
  }

  addMethod(method: PhpClassMethod): void {
    this.methods.set(method.getName(), method)
  }

  getMethods(): PhpClassMethod[] {
    return [...this.methods.values()]
  }
}
