import { fileURLToPath } from 'node:url'
import type { NitroPreset } from 'nitropack'

export default <NitroPreset>{
  extends: 'node-server',
  entry: fileURLToPath(new URL('entry.ts', import.meta.url)),
}
