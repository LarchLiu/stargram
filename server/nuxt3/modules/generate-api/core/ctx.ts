import { resolve } from 'node:path'
import * as fs from 'node:fs'
import { loadConfig } from 'unconfig'
import type { OutputConfig, ServerConfig } from '../../../composables/config'

export function createContext(root = process.cwd()) {
  const configFile = resolve(root, './stargram.config.json')
  if (!fs.existsSync(configFile))
    throw new Error('[stargram-generate-api] no stargram.config.json file')

  const defaultApiPath = resolve(root, './server/_api')
  const apiPath = resolve(root, './server/api')

  async function generateApi() {
    const { config } = await loadConfig<ServerConfig<OutputConfig>>({
      sources: [
        {
          files: 'stargram.config',
          extensions: ['json', ''],
        },
      ],
      merge: false,
    })
    if (config.app) {
      fs.cpSync(`${defaultApiPath}/${config.app.select}`, `${apiPath}/${config.app.select}`, { recursive: true })
      if (process.env.NODE_ENV === 'production')
        fs.cpSync(`${defaultApiPath}/config.product.ts`, `${apiPath}/config.ts`)
      else
        fs.cpSync(`${defaultApiPath}/config.dev.ts`, `${apiPath}/config.ts`)

      const sendMessage = config.app.select === 'telegram' ? 'sendMessageToTelegramWithContext(context)(message)' : `sendMessageToSlackBot(config.app.${config.app.select}, message)`
      const importArr = []
      const importStr = `import { errorMessage } from '@stargram/core/utils'
import { SaveWebInfoChain } from '@stargram/core/chain/saveWebInfo'
import type { UserConfig } from '../../utils/index'
import type { Context } from '../../utils/tgBot/context'
`
      let replaceCode = `
export default eventHandler(async (event) => {
  const body = await readBody(event)
  const url = body.url
  const context = body.context as Context
  const config = context.USER_CONFIG as UserConfig
`
      if (config.webInfo) {
        importArr.push(config.webInfo.import)
        if (config.webInfo.select === 'api') {
          replaceCode += `
  const webInfo = new ${config.webInfo.fn}({
    stargramHub: config.webInfo.api.stargramHub,
    browserlessToken: config.webInfo.api.browserlessToken,
  })
`
        }
        else {
          replaceCode += `
  const webInfo = new ${config.webInfo.fn}({
    routes,
    browserlessToken: config.webInfo.localFn.browserlessToken,
  })
`
        }
      }
      if (config.webCard) {
        importArr.push(config.webCard.import)
        if (config.webCard.select === 'api') {
          replaceCode += `
  const webCard = new ${config.webCard.fn}({ stargramHub: config.webCard.${config.webCard.select}.stargramHub })
`
        }
        else {
          importArr.push(config.imgStorage.import)
          const imgKeys = Object.keys(config.imgStorage.config!)
          const imgConfig = imgKeys.map((k) => {
            return `${k}: config.imgStorage.${config.imgStorage.select}.${k}`
          })
          replaceCode += `
  const imgStorage = new ${config.imgStorage.fn}({
    ${imgConfig.join(', ')},
  })
  const webCard = new ${config.webCard.fn}({ stargramHub: body.stargramHub, imgStorage })
`
        }
      }
      if (config.llm) {
        importArr.push(config.llm.import)
        const llmKeys = Object.keys(config.llm.config!)
        const llmConfig = llmKeys.map((k) => {
          return `${k}: config.llm.${config.llm.select}.${k}`
        })
        replaceCode += `
  const summarizeContent = new ${config.llm.fn}({
    ${llmConfig.join(', ')},
  })
`
      }
      if (config.dataStorage) {
        importArr.push(config.dataStorage.import)
        const dataKeys = Object.keys(config.dataStorage.config!)
        const dataConfig = dataKeys.map((k) => {
          return `${k}: config.dataStorage.${config.dataStorage.select}.${k}`
        })
        replaceCode += `
  const dataStorage = new ${config.dataStorage.fn}({
    ${dataConfig.join(', ')},
  })
`
      }

      replaceCode += `
  const chain = new SaveWebInfoChain({
    ${config.webInfo ? 'webInfo,' : ''}
    ${config.webCard ? 'webCard,' : ''}
    ${config.llm ? 'summarizeContent,' : ''}
    ${config.dataStorage ? 'dataStorage,' : ''}
  })

  const info = await chain.call({
    webUrl: url,
  }).then(_ => true).catch(e => errorMessage(e))

  let message = ''
  if (typeof info === 'boolean')
    message = \`Saved to Stargram 🎉. \${url}\\n\`
  else
    message = \`Save failed 🐛. \${url}\\nError Info: \${info}\\n\`

  try {
    return (await ${sendMessage})
  }
  catch (error) {
    console.error(error)
    return new Response(errorToString(error), { status: 200 })
  }
})
`
      const code = importArr.join('') + importStr + replaceCode
      fs.writeFileSync(`${apiPath}/${config.app.select}/save-web-info.ts`, code, 'utf-8')
    }
  }

  function copyDefaultConfigFile() {
    fs.cpSync(`${defaultApiPath}/stargram.config.default.json`, configFile)
  }

  return {
    root,
    generateApi,
    copyDefaultConfigFile,
  }
}
