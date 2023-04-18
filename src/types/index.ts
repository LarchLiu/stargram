interface PageData {
  title: string
  url: string
  content: string
  tabId?: number
}

interface SendResponse {
  message: string
  error?: boolean
  tabId?: number
}

type SwResponse = Error | SendResponse

export type {
  PageData,
  SendResponse,
  SwResponse,
}
