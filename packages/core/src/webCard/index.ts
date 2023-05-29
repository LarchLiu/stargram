import { $fetch } from 'ofetch'
import type { WebInfoData } from '../types'
import type { IDataStorage, IImageStorage, SavedData, SavedImage, StorageImage } from '../storage'

export type WebCardFn = (webData: WebInfoData) => Promise<StorageImage>

export class WebCardByApi {
  constructor(fields: {
    webData?: WebInfoData
    starNexusHub?: string
    headers?: Record<string, string>
  }) {
    this.apiUrl = (fields.starNexusHub || '') + this.apiUrl
    this.webData = fields.webData
    this.headers = fields.headers
    this.localFn = undefined
  }

  private apiUrl = '/api/webcard'
  private headers
  private webData
  public localFn = undefined

  async call(fields: { dataStorage: IDataStorage; savedData: SavedData; webData?: WebInfoData }) {
    if (!fields.webData && !this.webData)
      throw new Error('WebCard error: No WebInfo Data')

    const info = (fields.webData || this.webData)!
    const dataType = fields.dataStorage.getType()
    const dataCfg = fields.dataStorage.getConfig()
    const imgRes = await $fetch<SavedImage>(this.apiUrl, {
      method: 'POST',
      headers: this.headers,
      body: {
        webData: info,
        dataType,
        dataCfg,
        savedData: fields.savedData,
        byApi: true,
      },
    })

    return imgRes
  }
}

export class WebCard {
  constructor(fields: {
    imgStorage: IImageStorage
    webData?: WebInfoData
    starNexusHub?: string
    localFn?: WebCardFn
    headers?: Record<string, string>
  }) {
    this.apiUrl = (fields.starNexusHub || '') + this.apiUrl
    this.webData = fields.webData
    this.headers = fields.headers
    this.localFn = fields.localFn
    this.imgStorage = fields.imgStorage
  }

  private apiUrl = '/api/webcard'
  private headers
  private webData
  private imgStorage
  public localFn

  async call(fields: { dataStorage: IDataStorage; savedData: SavedData; webData?: WebInfoData }) {
    if (!fields.webData && !this.webData)
      throw new Error('WebCard error: No WebInfo Data')

    const info = (fields.webData || this.webData)!
    let res: StorageImage
    let imgRes: SavedImage

    if (this.localFn) {
      res = await this.localFn(info)
      const imgQuery = await this.imgStorage.query(res.imgPath)
      if (imgQuery.url)
        imgRes = await this.imgStorage.update(res)
      else
        imgRes = await this.imgStorage.create(res)

      await fields.dataStorage.updateOgImage(fields.savedData, imgRes.url)
    }
    else {
      const imgType = this.imgStorage.getType()
      const imgCfg = this.imgStorage.getConfig()
      const dataType = fields.dataStorage.getType()
      const dataCfg = fields.dataStorage.getConfig()
      imgRes = await $fetch<SavedImage>(this.apiUrl, {
        method: 'POST',
        headers: this.headers,
        body: {
          webData: info,
          imgType,
          imgCfg,
          dataType,
          dataCfg,
          savedData: fields.savedData,
        },
      })
    }

    return imgRes
  }
}
