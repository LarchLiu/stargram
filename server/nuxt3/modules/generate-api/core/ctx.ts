import { resolve } from 'node:path'
import * as fs from 'node:fs'
import { loadConfig } from 'unconfig'
import type { OutputConfig, ServerConfig } from '../../../composables/config'

export function createContext(root = process.cwd()) {
  const configFile = resolve(root, './starnexus.config.json')
  if (!fs.existsSync(configFile))
    throw new Error('[starnexus-generate-api] no starnexus.config.json file')

  const defaultApiPath = resolve(root, './server/_api')
  const apiPath = resolve(root, './server/api')

  async function generateApi() {
    const { config } = await loadConfig<ServerConfig<OutputConfig>>({
      sources: [
        {
          files: 'starnexus.config',
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
      const importArr = []
      const importStr = `import { errorMessage } from '@starnexus/core/utils'
import { SaveWebInfoChain } from '@starnexus/core/chain/saveWebInfo'
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
    urls: {
      webUrl: url,
    },
    starNexusHub: config.webInfo.${config.webInfo.select}.starNexusHub,
  })
`
        }
        else {
          replaceCode += `
  const ogInfo = new OGInfo({ fn: ogInfoFn, url })
  const webInfo = new ${config.webInfo.fn}({
    urls: {
      webUrl: url,
    },
    routes,
    ogInfo,
  })
`
        }
      }
      if (config.webCard) {
        importArr.push(config.webCard.import)
        if (config.webCard.select === 'api') {
          replaceCode += `
  const webCard = new ${config.webCard.fn}({ starNexusHub: config.webCard.${config.webCard.select}.starNexusHub })
`
        }
        else {
          importArr.push(config.imgStorage.import)
          const imgKeys = Object.keys(config.imgStorage.config)
          const imgConfig = imgKeys.map((k) => {
            return `${k}: config.imgStorage.${config.imgStorage.select}.${k}`
          })
          replaceCode += `
  const imgStorage = new ${config.imgStorage.fn}({
    ${imgConfig.join(', ')},
  })
  const webCard = new ${config.webCard.fn}({ starNexusHub: body.starNexusHub, imgStorage })
`
        }
      }
      if (config.llm) {
        importArr.push(config.llm.import)
        const llmKeys = Object.keys(config.llm.config)
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
        const dataKeys = Object.keys(config.dataStorage.config)
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

  const info = await chain.call().then(_ => true).catch(e => errorMessage(e))

  let message = ''
  if (typeof info === 'boolean')
    message = \`Saved to StarNexus 🎉. \${url}\\n\`
  else
    message = \`Save failed 🐛. \${url}\\nError Info: \${info}\\n\`

  try {
    return (await sendMessageToTelegramWithContext(context)(message))
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
    fs.cpSync(`${defaultApiPath}/starnexus.config.default.json`, configFile)
    fs.cpSync(`${defaultApiPath}/config.dev.ts`, `${apiPath}/config.ts`)
  }

  return {
    root,
    generateApi,
    copyDefaultConfigFile,
  }
}
