import { format } from 'prettier'
// @ts-ignore
import * as prettierPluginPhp from '@prettier/plugin-php'
import type { MageModule, MageNewCommand } from '~/lib/types'
import { getModulePhpNamespace } from '~/lib/mage/modules'
import PhpProgram from '~/lib/php-program'
import PhpClass from '~/lib/php-class'
import PhpClassMethod from '~/lib/php-class-method'
import generateAstFromPhpProgram from '~/lib/generator/php/generate-ast-from-php-program'
import { generatePhpFromAst } from '~/lib/generator/php'

export default async function (module: MageModule, command: MageNewCommand): Promise<string> {
  const phpProgram = generatePhpProgramForCommand(command, module)

  const ast = generateAstFromPhpProgram(phpProgram)

  const php = generatePhpFromAst(ast)

  return await format(php, {
    plugins: [prettierPluginPhp],
    printWidth: 120,
    parser: 'php',
    singleQuote: true,
  })
}

export const generatePhpProgramForCommand = (command: MageNewCommand, module: MageModule): PhpProgram => {
  const phpProgram = new PhpProgram(`${getModulePhpNamespace(module)}\\Console\\Command`)

  phpProgram.addDeclare('strict_types', '1')

  phpProgram.addUse('Magento\\Framework\\Console\\Cli')
  phpProgram.addUse('Symfony\\Component\\Console\\Command\\Command')
  phpProgram.addUse('Symfony\\Component\\Console\\Input\\InputInterface')
  phpProgram.addUse('Symfony\\Component\\Console\\Output\\OutputInterface')

  const phpClass = new PhpClass(String(command.class), 'Command')

  const constructMethod = new PhpClassMethod('__construct')
  if (command.injects.includes('logger')) {
    phpProgram.addUse('Psr\\Log\\LoggerInterface')

    constructMethod.addArgument({
      name: 'logger',
      type: 'LoggerInterface',
      visibility: 'private',
      readonly: true,
    })
  }

  if (command.injects.includes('scopeConfig')) {
    phpProgram.addUse('Magento\\Framework\\App\\Config\\ScopeConfigInterface')

    constructMethod.addArgument({
      name: 'scopeConfig',
      type: 'ScopeConfigInterface',
      visibility: 'private',
      readonly: true,
    })
  }

  // TODO: check PHP version
  // phpClass.addProperty({
  //   name: 'logger',
  //   type: 'LoggerInterface',
  //   visibility: 'private',
  //   value: 'null',
  // })

  constructMethod.setBody(`parent::__construct();`)

  phpClass.addMethod(constructMethod)

  const configureMethod = new PhpClassMethod('configure', 'public', false, undefined, 'void')
  const configureBody = `
            $this->setName('${command.name}');
            $this->setDescription('${command.description}');`

  configureMethod.setBody(configureBody)

  phpClass.addMethod(configureMethod)

  phpProgram.addClass(phpClass)

  const executeMethod = new PhpClassMethod('execute', 'public', false, undefined, 'int')
  executeMethod.addArgument({
    name: 'input',
    type: 'InputInterface',
  })
  executeMethod.addArgument({
    name: 'output',
    type: 'OutputInterface',
  })

  const executeBody = `$output->writeln('Mage Wizard CLI');\n\n
        return Cli::RETURN_SUCCESS;`

  executeMethod.setBody(executeBody)

  phpClass.addMethod(executeMethod)

  return phpProgram
}
