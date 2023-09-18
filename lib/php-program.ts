import type { PhpClass, PhpProgram } from '~/lib/generator/php/types'

export default class implements PhpProgram {
  private namespace: string = ''
  private classes: PhpClass[] = []
  private declares: Map<string, string> = new Map()
  private uses: Map<string, string> = new Map()

  constructor(namespace?: string | undefined) {
    if (namespace) {
      this.namespace = namespace
    }
  }

  getDeclares(): Map<string, string> {
    return this.declares
  }

  getUses(): Map<string, string> {
    return this.uses
  }

  addClass(phpClass: PhpClass) {
    this.classes.push(phpClass)
  }

  getClasses(): PhpClass[] {
    return [...this.classes.values()]
  }

  setNamespace(namespace: string) {
    this.namespace = namespace
  }

  getNamespace(): string {
    return this.namespace
  }

  addDeclare(name: string, value: string) {
    this.declares.set(name, value)
  }

  addUse(name: string, alias?: string) {
    this.uses.set(name, alias ?? name)
  }
}
