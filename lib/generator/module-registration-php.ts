import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (namespace: string, module: string): string {
  const template = Handlebars.compile(fs.readFileSync(`${__dirname}/../../lib/templates/module/registration.php.hbs`, 'utf8'));

  return template({ moduleName: `${namespace}_${module}` });
}
