import { storageInfo } from '@stargram/core/storage'
import type { IDataStorage } from '@stargram/core/storage'

export default eventHandler(async (event) => {
  const { appId } = useRuntimeConfig()
  const body = await readBody(event)
  const userId = body.userId
  const pageSize = Number.parseInt(body.pageSize)
  const page = body.page

  const config = await getUserConfig('stargram', appId, userId) as UserConfig
  const dataStorage = new (storageInfo.DataStorage[config.dataStorage.select])(config.dataStorage.config) as IDataStorage
  const list = await dataStorage.list(pageSize, page)

  return list
})
