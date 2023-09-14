import fs from 'node:fs'
import path from 'node:path'
import getSettings from '~/lib/settings'
import getVersionEol from '~/lib/mage/version-eol'

export default defineEventHandler((event) => {
  const basePath = getSettings()?.path

  if (!basePath) {
    createError({
      message: 'No Magento path configured',
      statusCode: 500,
    })
    return
  }

  const composerJsonPath = path.join(basePath, 'composer.json')
  const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, 'utf8'))

  if (!composerJson.version) {
    createError({
      message: 'No Magento version found',
      statusCode: 500,
    })
    return
  }

  return {
    version: composerJson.version,
    eol: getVersionEol(composerJson.version),
  }
})
