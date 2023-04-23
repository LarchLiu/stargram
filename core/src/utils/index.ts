async function fetchGet<T>(url: string, header: Record<string, string> = {}, query: Record<string, string> = {}): Promise<T> {
  if (query && Object.keys(query).length)
    url += `?${new URLSearchParams(query).toString()}`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: header,
    })
    if (!res.ok)
      throw new Error(res.statusText)

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
  getHost,
}
