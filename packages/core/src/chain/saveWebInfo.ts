import type { WebInfo, WebInfoByApi } from '../webInfo'
import type { WebCard } from '../webCard'
import type { SummarizeContent } from '../openai'
import type { SummarizeData } from '../types'
import type { IDataStorage } from '../storage'

export class SaveWebInfoChain {
  constructor(fields: {
    webInfo: WebInfo | WebInfoByApi
    webCard?: WebCard
    summarizeContent?: SummarizeContent
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

  async call() {
    const webData = await this.webInfo.call()
    let summarizeData: SummarizeData = {
      summary: webData.content,
      categories: ['Others'],
    }

    if (this.summarizeContent)
      summarizeData = await this.summarizeContent.call(webData)

    const savedData = await this.dataStorage.create({ ...webData, ...summarizeData })
    // if there is no localFn just use api to generate webCard and update to data storage, don't mind the result
    // DO NOT USE AWAIT to avoid severless timeout, generate webCard need long time
    if (this.webCard && !this.webCard.localFn) {
      // eslint-disable-next-line no-console
      this.webCard.call({ dataStorage: this.dataStorage, webData, savedData }).then(res => console.log(res))
    }

    return savedData
  }
}
