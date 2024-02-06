// server/api/webcard.ts

import { errorMessage } from '@stargram/core/utils'
import { storageInfo } from '@stargram/core/storage'
import type { WebInfoData } from '@stargram/core'
import type { IDataStorage, IImageStorage, TStorage } from '@stargram/core/storage'
import { cryption } from '~/constants'
import type { OutUserConfig, ServerConfig } from '~/composables/config'

export default eventHandler(async (event) => {
  try {
    const {
      webData,
      imgType,
      imgCfg,
      dataType,
      dataCfg,
      savedData,
      byApi,
    } = await readBody(event)
    let imgStorage: IImageStorage
    if (byApi) {
      let botConfig
      let fnName = ''
      let imgConfig
      const telegramConfig = await getBotConfig('telegram')
      if (telegramConfig.default) {
        const id = telegramConfig.default.split(':')[0]
        botConfig = JSON.parse(cryption.decode(telegramConfig[id].config)) as ServerConfig<OutUserConfig>
        fnName = botConfig.imgStorage.select
        imgConfig = botConfig.imgStorage.config
      }
      else {
        const stargramConfig = await getBotConfig('stargram')
        if (stargramConfig.default) {
          const id = stargramConfig.default
          botConfig = JSON.parse(cryption.decode(stargramConfig[id].config)) as ServerConfig<OutUserConfig>
          fnName = botConfig.imgStorage.select
          imgConfig = botConfig.imgStorage.config
        }
        else {
          const slackConfig = await getBotConfig('slack')
          if (slackConfig.default) {
            const id = slackConfig.default
            botConfig = JSON.parse(cryption.decode(slackConfig[id].config)) as ServerConfig<OutUserConfig>
            fnName = botConfig.imgStorage.select
            imgConfig = botConfig.imgStorage.config
          }
        }
      }
      if (!fnName || !imgConfig) {
        setResponseStatus(event, 400)
        return { error: 'No Public Image Storage' }
      }
      imgStorage = new (storageInfo.ImageStorage[fnName])(imgConfig) as IImageStorage
    }
    else {
      imgStorage = new (storageInfo[imgType.type as TStorage][imgType.name])(imgCfg) as IImageStorage
    }
    const dataStorage = new (storageInfo[dataType.type as TStorage][dataType.name])(dataCfg) as IDataStorage
    const res = await createWebCard(webData as WebInfoData)
    // const imgQuery = await imgStorage.query(res.imgPath)
    // if (imgQuery.url)
    //   imgRes = await imgStorage.update(res)
    // else
    const imgRes = await imgStorage.create(res)

    const updateRes = await dataStorage.updateOgImage(savedData, imgRes.url)
    return updateRes
  }
  catch (error: any) {
    setResponseStatus(event, 400)

    const message = errorMessage(error)
    return { error: message }
  }
})
