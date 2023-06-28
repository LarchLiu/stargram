import type { WebInfo, WebInfoByApi } from '../webInfo'
import type { WebCard, WebCardByApi } from '../webCard'
import type { Openai } from '../llm/openai'
import type { SummarizeData, WebLoaderUrls } from '../types'
import type { IDataStorage, IVectorStorage } from '../storage'
import { errorMessage } from '../utils'

export class SaveWebInfoChain {
  constructor(fields: {
    webInfo: WebInfo | WebInfoByApi
    webCard?: WebCard | WebCardByApi
    llm?: Openai
    dataStorage: IDataStorage
    vectorStorage?: IVectorStorage
  }) {
    this.webInfo = fields.webInfo
    this.webCard = fields.webCard
    this.llm = fields.llm
    this.dataStorage = fields.dataStorage
    this.vectorStorage = fields.vectorStorage
  }

  private webInfo
  private webCard
  private llm
  private dataStorage
  private vectorStorage

  async call(urls: WebLoaderUrls) {
    const webData = await this.webInfo.call(urls)
    let summarizeData: SummarizeData = {
      summary: webData.content,
      categories: ['Others'],
    }

    if (this.llm) {
      summarizeData = await this.llm.summarize(webData)
      if (this.vectorStorage) {
        if (this.dataStorage) {
          this.dataStorage.query(urls.webUrl).then((res) => {
            if (!res)
              this.vectorStorage!.save(webData)
          })
        }
      }
    }

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
