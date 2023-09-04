import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'
import type { MageModule, MageNewCommand } from '~/lib/types'
import { getModulePhpNamespace } from '~/lib/mage/modules'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function (module: MageModule, command: MageNewCommand): string {
  const template = Handlebars.compile(fs.readFileSync(`${__dirname}/../../lib/templates/module/command.hbs`, 'utf8'))

  return template({
    class: command.class,
    name: command.name,
    description: command.description,
    namespace: getModulePhpNamespace(module),
  })
}
