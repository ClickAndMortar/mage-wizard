import '#internal/nitro/virtual/polyfill'
import { Server } from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { toNodeListener } from 'h3'
// @ts-ignore
import type { ParsedArgs } from 'minimist'
// @ts-ignore
import parseArgs from 'minimist'

const nitroApp = useNitroApp()
const server = new Server(toNodeListener(nitroApp.h3App))

const port = Number.parseInt(process.env.PORT || '3000')
const host = process.env.HOST || '127.0.0.1'

const arguments_: ParsedArgs = parseArgs(process.argv.slice(2))

if (!arguments_.path) {
  console.error('No path argument provided')
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}

if (!fs.existsSync(path.join(arguments_.path, 'composer.json'))) {
  console.error('Provided path is not a Magento 2 project')
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}

// @ts-ignore
server.listen(port, host, (error) => {
  if (error) {
    console.error(error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }

  console.log(`Listening on http://${host}:${port}`)
})
