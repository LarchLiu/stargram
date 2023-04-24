import type { NotThrowError } from '../types'

async function fetchGet<T>(url: string, headers?: HeadersInit, query?: Record<string, string>, throwError = true): Promise<T | NotThrowError> {
  try {
    const reqOpt: RequestInit = {
      method: 'GET',
      headers,
    }

    if (query && Object.keys(query).length)
      url += `?${new URLSearchParams(query).toString()}`

    const res = await fetch(url, reqOpt)
    if (!res.ok) {
      let message = res.statusText
      const type = res.headers.get('content-type')
      if (type && type.includes('application/json')) {
        const json = await res.json()
        message = json.error?.message || json.message || res.statusText
      }
      else if (type && type.includes('text/')) {
        const text = await res.text()
        message = text
      }
      if (!throwError)
        return { error: message }

      throw new Error(message)
    }

    let data: any = res
    const type = res.headers.get('content-type')
    if (type && type.includes('application/json'))
      data = await res.json()
    else if (type && type.includes('text/'))
      data = await res.text()
    return data as T
  }
  catch (err: any) {
    throw new Error(err.message)
  }
}

async function fetchPost<T>(url: string, headers?: HeadersInit, body?: Record<string, any>, patch?: boolean, throwError = true): Promise<T | NotThrowError> {
  try {
    const reqOpt: RequestInit = {
      method: patch ? 'PATCH' : 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }

    const res = await fetch(url, reqOpt)
    if (!res.ok) {
      let message = res.statusText
      const type = res.headers.get('content-type')
      if (type && type.includes('application/json')) {
        const json = await res.json()
        message = json.error?.message || json.message || res.statusText
      }
      else if (type && type.includes('text/')) {
        const text = await res.text()
        message = text
      }
      if (!throwError)
        return { error: message }

      throw new Error(message)
    }

    let data: any = res
    const type = res.headers.get('content-type')
    if (type && type.includes('application/json'))
      data = await res.json()
    else if (type && type.includes('text/'))
      data = await res.text()
    return data as T
  }
  catch (err: any) {
    throw new Error(err.message)
  }
}

function getHost(url: string) {
  const match = url.match(/https?:\/\/([^/]+)\//i)
  let host = ''
  if (match && match[1])
    host = match[1]

  return host
}

export {
  fetchGet,
  fetchPost,
  getHost,
}
