import {getModules} from '~/lib/mage/modules';

export default defineEventHandler((event) => {
  return getModules();
})
