import type { Program, Declare, Namespace, Class, Method, Block, ExpressionStatement, Expression } from 'php-parser'

export const generatePhpFromAst = (ast: Program): string => {
  let output = `<?php\n\n`

  for (const child of ast.children) {
    if (child.kind === 'declare') {
      output += generateDeclareOutput(child as Declare)
    }

    if (child.kind === 'namespace') {
      output += generateNamespaceOutput(child as Namespace)
    }
  }

  output += `\n`

  return output
}

const generateDeclareOutput = (node: Declare): string => {
  for (const directive of node.directives) {
    if (directive.kind === 'declaredirective') {
      // @ts-ignore
      return `declare(${directive.key.name}=${directive.value.value});\n\n`
    }
  }

  return ''
}

const generateNamespaceOutput = (node: Namespace): string => {
  let output = `namespace ${node.name};\n\n`

  for (const child of node.children) {
    if (child.kind === 'usegroup') {
      output += generateUseGroupOutput(child)
    }

    if (child.kind === 'class') {
      output += generateClassOutput(child as Class)
    }
  }

  return output
}

const generateUseGroupOutput = (node: any): string => {
  for (const item of node.items) {
    if (item.kind === 'useitem') {
      let output = `use ${item.name}`
      if (item.alias) {
        output += ` as ${item.alias.name}`
      }
      return `${output};\n`
    }
  }

  return ''
}

const generateClassOutput = (node: Class): string => {
  // @ts-ignore
  let output = `\nclass ${node.name.name}`
  if (node.extends) {
    output += ` extends ${node.extends.name}`
  }
  if (node.implements) {
    // @ts-ignore
    output += ` implements ${node.implements.map((implement) => implement.name).join(', ')}`
  }
  output += `\n{\n`

  for (const child of node.body) {
    if (child.kind === 'method') {
      output += generateMethodOutput(child as Method)
    }

    if (child.kind === 'propertystatement') {
      // @ts-ignore
      output += `${child.visibility} ${child.isStatic ? 'static' : ''} `
      const properties: string[] = []
      // @ts-ignore
      for (const property of child.properties) {
        let property_ = ''
        if (property.readonly) {
          property_ += 'readonly '
        }
        if (property.type) {
          property_ += `${property.nullable ? '?' : ''}${generateExpressionOutput(property.type)} `
        }
        property_ += `$${generateExpressionOutput(property.name)} `
        if (property.value) {
          property_ += ` = ${generateExpressionOutput(property.value)}`
        }
        properties.push(property_)
      }
      output += properties.join(', ') + ';\n\n'
    }
  }

  output += `}`

  return output
}

const generateMethodOutput = (node: Method): string => {
  // @ts-ignore
  let output = `${node.visibility} ${node.readonly ? 'readonly ' : ''}${node.isStatic ? 'static ' : ''}function ${node.name.name}(`

  const arguments_ = []
  for (const argument of node.arguments) {
    // TODO: should use generateExpressionOutput for kind=parameter
    let argument_ = ``

    if (argument.loc && argument.loc.source) {
      if (argument.loc.source.startsWith('private ')) {
        argument_ += 'private '
      } else if (argument.loc.source.startsWith('protected ')) {
        argument_ += 'protected '
      } else if (argument.loc.source.startsWith('public ')) {
        argument_ += 'public '
      }
    }

    // @ts-ignore
    if (argument.visibility) {
      // @ts-ignore
      argument_ += `${argument.visibility} `
    }

    if (argument.readonly) {
      argument_ += 'readonly '
    }

    // @ts-ignore
    argument_ += `${argument.type.name} ${argument.byref ? '&' : ''}$${argument.name.name}`
    if (argument.value) {
      // @ts-ignore
      argument_ += ` = ${argument.value.raw}`
    }
    arguments_.push(argument_)
  }
  output += arguments_.join(', ')

  const returnType = node.type ? `: ${node.type.name}` : ''

  output += `)${returnType} {\n`

  output += generateMethodBodyOutput(node.body as Block)

  output += `}\n\n`

  return output
}

const generateMethodBodyOutput = (body: Block | string) => {
  if (!body) {
    return ''
  }

  if (typeof body === 'string') {
    return body
  }

  let output = ''
  // @ts-ignore
  const children: ExpressionStatement[] = body.children

  for (const child of children) {
    if (child.kind === 'expressionstatement') {
      output += `${generateExpressionOutput(child.expression)};`
      continue
    }

    if (child.kind === 'return') {
      // @ts-ignore
      output += `return ${generateExpressionOutput(child.expr as Expression)};`
    }
  }

  return output
}

const generateExpressionOutput = (expression: any): string => {
  if (expression.kind === 'call') {
    let callOutput = `${generateExpressionOutput(expression.what)}(`

    const callArguments = []
    for (const callArgument of expression.arguments || []) {
      callArguments.push(generateExpressionOutput(callArgument))
    }

    callOutput += callArguments.join(', ')

    return `${callOutput})`
  }

  if (expression.kind === 'assign') {
    return `${generateExpressionOutput(expression.left)} ${expression.operator} ${generateExpressionOutput(expression.right)};\n`
  }

  if (expression.kind === 'propertylookup') {
    return `${generateExpressionOutput(expression.what)}->${expression.offset.name}`
  }

  if (expression.kind === 'staticlookup') {
    return `${generateExpressionOutput(expression.what)}::${expression.offset.name}`
  }

  if (expression.kind === 'variable') {
    if (expression.curly) {
      return `\${${expression.name}}`
    }

    return `$${expression.name}`
  }

  if (expression.kind === 'string') {
    return expression.raw
  }

  if (expression.kind === 'name') {
    return expression.name
  }

  if (expression.kind === 'identifier') {
    return expression.name
  }

  if (expression.kind === 'parentreference') {
    return expression.raw
  }

  if (expression.kind === 'nullkeyword') {
    return expression.raw
  }

  return ''
}
