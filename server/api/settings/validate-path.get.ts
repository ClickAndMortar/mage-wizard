import fs from 'node:fs'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  if (!query.path) {
    createError({
      statusCode: 400,
      message: 'Missing path parameter',
    })
  }

  const valid = fs.existsSync(`${String(query.path)}/composer.json`)

  return {
    valid,
  }
})
