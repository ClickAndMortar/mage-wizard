import {createModule} from '~/lib/mage/modules';
import {MageModule} from "~/lib/types";

export default defineEventHandler(async (event) => {
  const module: MageModule = await readBody(event);
  createModule(module);
})