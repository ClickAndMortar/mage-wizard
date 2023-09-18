import type { PhpClassMethod, PhpMethodArgument, PhpClassMethodType, PhpClassMethodReturnType, PhpVisibility } from '~/lib/generator/php/types'

export default class implements PhpClassMethod {
  private readonly name: string
  private readonly visibility: PhpVisibility
  private readonly static_: boolean
  private readonly type: PhpClassMethodType | undefined
  private readonly returnType: PhpClassMethodReturnType | undefined
  private body: string = ''
  private arguments: Map<string, PhpMethodArgument> = new Map()

  constructor(name: string, visibility: PhpVisibility = 'public', static_: boolean = false, type?: PhpClassMethodType, returnType?: PhpClassMethodReturnType) {
    this.name = name
    this.visibility = visibility
    this.static_ = static_
    this.type = type
    this.returnType = returnType
  }

  getType(): PhpClassMethodType | undefined {
    return this.type
  }

  getReturnType(): PhpClassMethodReturnType | undefined {
    return this.returnType
  }

  getName(): string {
    return this.name
  }

  setBody(body: string): void {
    this.body = body
  }

  getBody(): string {
    return this.body
  }

  addArgument(argument: PhpMethodArgument): void {
    this.arguments.set(argument.name, argument)
  }

  getArguments(): PhpMethodArgument[] {
    return [...this.arguments.values()]
  }

  getVisibility(): PhpVisibility {
    return this.visibility
  }
}
