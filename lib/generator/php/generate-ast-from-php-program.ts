import type { PhpProgram } from '~/lib/generator/php/types'

export default function (program: PhpProgram): any {
  const ast: any = {}
  ast.kind = 'program'
  ast.children = []

  for (const [identifier, value] of program.getDeclares()) {
    const declareNode: any = {
      kind: 'declare',
      directives: [
        {
          kind: 'declaredirective',
          key: {
            kind: 'identifier',
            name: identifier,
          },
          value: {
            kind: 'string',
            value,
          },
        },
      ],
    }

    ast.children.push(declareNode)
  }

  const namespaceNode: any = {
    kind: 'namespace',
    name: program.getNamespace(),
    children: [],
  }

  for (const [name, alias] of program.getUses()) {
    const useNode: any = {
      kind: 'usegroup',
      items: [
        {
          kind: 'useitem',
          name,
          alias: alias === name ? undefined : { kind: 'identifier', name: alias },
        },
      ],
    }

    namespaceNode.children.push(useNode)
  }

  for (const phpClass of program.getClasses()) {
    const classNode: any = {
      kind: 'class',
      name: {
        kind: 'identifier',
        name: phpClass.getName(),
      },
      isAnonymous: false,
      extends: phpClass.getExtend()
        ? {
            kind: 'identifier',
            name: phpClass.getExtend(),
          }
        : null,
      implements: phpClass.getImplement().length > 0 ? phpClass.getImplement()?.map((name) => ({ kind: 'identifier', name })) : undefined,
      body: [],
    }

    for (const _phpClassConstant of phpClass.getConstants()) {
      // TODO
    }

    for (const phpClassProperty of phpClass.getProperties()) {
      const propertyNode: any = {
        kind: 'propertystatement',
        properties: [
          {
            kind: 'property',
            name: {
              kind: 'identifier',
              name: phpClassProperty.name,
            },
            // TODO: handle value kind
            value: {
              kind: 'nullkeyword',
              raw: phpClassProperty.value,
            },
            readonly: phpClassProperty.readonly ?? false,
            nullable: phpClassProperty.nullable ?? false,
            type: {
              kind: 'name',
              name: phpClassProperty.type ?? '',
              resolution: 'uqn',
            },
          },
        ],
        visibility: phpClassProperty.visibility,
        isStatic: phpClassProperty.static ?? false,
      }

      classNode.body.push(propertyNode)
    }

    for (const phpClassMethod of phpClass.getMethods()) {
      const methodNode: any = {
        kind: 'method',
        name: {
          kind: 'identifier',
          name: phpClassMethod.getName(),
        },
        arguments: [],
        type: phpClassMethod.getReturnType() ? { kind: 'name', name: phpClassMethod.getReturnType(), resolution: 'uqn' } : null,
        isAbstract: phpClassMethod.getType() === 'abstract',
        isFinal: phpClassMethod.getType() === 'final',
        isReadonly: false,
        visibility: phpClassMethod.getVisibility(),
        isStatic: phpClassMethod.getType() === 'static',
        body: phpClassMethod.getBody(),
      }

      for (const phpMethodArgument of phpClassMethod.getArguments()) {
        const argumentNode: any = {
          kind: 'parameter',
          name: {
            kind: 'identifier',
            name: phpMethodArgument.name,
          },
          // TODO: handle value type in raw param (i.e. enclose in quotes if string)
          value: phpMethodArgument.value ? { kind: 'string', value: phpMethodArgument.value, raw: phpMethodArgument.value } : null,
          type: phpMethodArgument.type ? { kind: 'name', name: phpMethodArgument.type, resolution: 'uqn' } : null,
          byref: phpMethodArgument.byReference ?? false,
          readonly: phpMethodArgument.readonly ?? false,
          nullable: phpMethodArgument.nullable ?? false,
          visibility: phpMethodArgument.visibility,
        }

        methodNode.arguments.push(argumentNode)
      }

      classNode.body.push(methodNode)
    }

    namespaceNode.children.push(classNode)
  }

  ast.children.push(namespaceNode)

  return ast
}
