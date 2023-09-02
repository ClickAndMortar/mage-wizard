import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {MageModule} from "~/lib/types";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (module: MageModule): string {
  const template = Handlebars.compile(fs.readFileSync(`${__dirname}/../../lib/templates/module/registration.php.hbs`, 'utf8'));

  return template({ moduleName: module.fqn });
}
