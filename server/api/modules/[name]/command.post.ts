import {createCommand} from '~/lib/mage/modules';
import {MageNewCommand, MageModule} from "~/lib/types";

export default defineEventHandler(async (event) => {
  const command: MageNewCommand = await readBody(event);
  createCommand(command);
})
