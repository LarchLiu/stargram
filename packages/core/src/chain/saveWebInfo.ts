import type { WebInfo, WebInfoByApi } from '../webInfo'
import type { WebCard, WebCardByApi } from '../webCard'
import type { OpenaiSummarizeContent } from '../llm/openai'
import type { SummarizeData, WebLoaderUrls } from '../types'
import type { IDataStorage } from '../storage'
import { errorMessage } from '../utils'

export class SaveWebInfoChain {
  constructor(fields: {
    webInfo: WebInfo | WebInfoByApi
    webCard?: WebCard | WebCardByApi
    summarizeContent?: OpenaiSummarizeContent
    dataStorage: IDataStorage
  }) {
    this.webInfo = fields.webInfo
    this.webCard = fields.webCard
    this.summarizeContent = fields.summarizeContent
    this.dataStorage = fields.dataStorage
  }

  private webInfo
  private webCard
  private summarizeContent
  private dataStorage

  async call(urls: WebLoaderUrls) {
    const webData = await this.webInfo.call(urls)
    let summarizeData: SummarizeData = {
      summary: webData.content,
      categories: ['Others'],
    }

    if (this.summarizeContent)
      summarizeData = await this.summarizeContent.call(webData)

    const savedData = await this.dataStorage.create({ ...webData, ...summarizeData })

    if (this.webCard) {
      if (!this.webCard.localFn) {
      // if there is no localFn just use api to generate webCard and update to data storage, don't mind the result
      // DO NOT USE AWAIT to avoid severless timeout, generate webCard need long time
      // eslint-disable-next-line no-console
        this.webCard.call({ dataStorage: this.dataStorage, webData, savedData }).then(res => console.log(res)).catch(e => console.error(errorMessage(e)))
      }
      else {
        await this.webCard.call({ dataStorage: this.dataStorage, webData, savedData })
      }
    }

    return savedData
  }
}
