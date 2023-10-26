import { format } from 'prettier'
// @ts-ignore
import * as prettierPluginPhp from '@prettier/plugin-php'
import type { MageModule, MageNewPatch } from '~/lib/types'
import { getModulePhpNamespace } from '~/lib/mage/modules'
import PhpProgram from '~/lib/php-program'
import PhpClass from '~/lib/php-class'
import PhpClassMethod from '~/lib/php-class-method'
import generateAstFromPhpProgram from '~/lib/generator/php/generate-ast-from-php-program'
import { generatePhpFromAst } from '~/lib/generator/php'

export default async function (module: MageModule, patch: MageNewPatch): Promise<string> {
  const phpProgram = generatePhpProgramForPatch(patch, module)

  const ast = generateAstFromPhpProgram(phpProgram)

  const php = generatePhpFromAst(ast)

  console.log('php', php)

  return await format(php, {
    plugins: [prettierPluginPhp],
    printWidth: 120,
    parser: 'php',
    singleQuote: true,
  })
}

export const generatePhpProgramForPatch = (patch: MageNewPatch, module: MageModule): PhpProgram => {
  const phpProgram = new PhpProgram(`${getModulePhpNamespace(module)}\\Setup\\Patch\\${patch.type === 'data' ? 'Data' : 'Schema'}`)

  phpProgram.addDeclare('strict_types', '1')

  let implement = ''

  if (patch.type === 'data') {
    phpProgram.addUse('Magento\\Framework\\Setup\\Patch\\DataPatchInterface')
    implement = 'DataPatchInterface'
  } else if (patch.type === 'schema') {
    phpProgram.addUse('Magento\\Framework\\Setup\\Patch\\SchemaPatchInterface')
    implement = 'SchemaPatchInterface'
  } else {
    throw new Error(`Unknown patch type: ${patch.type}`)
  }

  const phpClass = new PhpClass(`${patch.name}Patch`, undefined, [implement])

  const applyMethod = new PhpClassMethod('apply', 'public', true, undefined, 'void')
  const applyBody = `// Add your code here\n`

  applyMethod.setBody(applyBody)

  phpClass.addMethod(applyMethod)

  const getDependenciesMethod = new PhpClassMethod('getDependencies', 'public', true, 'static', 'array')
  const getDependenciesBody = `return [];\n`

  getDependenciesMethod.setBody(getDependenciesBody)

  phpClass.addMethod(getDependenciesMethod)

  const getAliasesMethod = new PhpClassMethod('getAliases', 'public', false, undefined, 'array')
  const getAliasesBody = `return [];\n`

  getAliasesMethod.setBody(getAliasesBody)

  phpClass.addMethod(getAliasesMethod)

  phpProgram.addClass(phpClass)

  return phpProgram
}
