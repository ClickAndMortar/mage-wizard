import Handlebars from 'handlebars';
import fs from 'fs';

export default function (namespace: string, module: string): string {
  const template = Handlebars.compile(fs.readFileSync(`${__dirname}/../../templates/module/registration.php.hbs`, 'utf8'));

  return template({ moduleName: `${namespace}_${module}` });
}
