import '#internal/nitro/virtual/polyfill'
import { Server } from 'node:http'
import { toNodeListener } from 'h3'

const nitroApp = useNitroApp()
const server = new Server(toNodeListener(nitroApp.h3App))

const port = Number.parseInt(process.env.PORT || '3000')
const host = process.env.HOST || '127.0.0.1'

// @ts-ignore
server.listen(port, host, (error) => {
  if (error) {
    console.error(error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }

  console.log(`Listening on http://${host}:${port}`)
})
