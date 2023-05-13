import type { WebInfo, WebInfoByApi } from '../webInfo'
import type { WebCard } from '../webCard'
import type { SummarizeContent } from '../openai'
import type { SummarizeData } from '../types'
import type { NotionStorage } from '../notion'

export class SaveWebInfoChain {
  constructor(fields: {
    webInfo: WebInfo | WebInfoByApi
    webCard?: WebCard
    summarizeContent?: SummarizeContent
    dataStorage: NotionStorage
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
    let webData = await this.webInfo.call()
    if (this.webCard)
      webData = await this.webCard.call(webData)

    let summarizeData: SummarizeData = {
      summary: webData.content,
      categories: ['Others'],
    }

    if (this.summarizeContent)
      summarizeData = await this.summarizeContent.call(webData)

    return await this.dataStorage.call({ ...webData, ...summarizeData })
  }
}
