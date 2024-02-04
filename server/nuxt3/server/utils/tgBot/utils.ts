import { CONST } from './env'

const kv = useStorage('kv')
export function randomString(length: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export async function historyPassword() {
  let password = await kv.getItem(CONST.PASSWORD_KEY)
  if (password === null) {
    password = randomString(32)
    await kv.setItem(CONST.PASSWORD_KEY, password)
  }
  return password
}

export function renderHTML(body: string) {
  return `
<html>  
  <head>
    <title>ChatGPT-Telegram-Workers</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="ChatGPT-Telegram-Workers">
    <meta name="author" content="TBXark">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }
      p {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
      }
      a:hover {
        color: #0056b3;
        text-decoration: underline;
      }
      strong {
        font-weight: bolder;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
  `
}

export function errorToString(e: any) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack,
  })
}

export function mergeConfig(config: Record<string, any>, key: string, value: any, i18n: any) {
  switch (typeof config[key]) {
    case 'number':
      config[key] = Number(value)
      break
    case 'boolean':
      config[key] = value === 'true'
      break
    case 'string':
      config[key] = value
      break
    case 'object':
      // eslint-disable-next-line no-case-declarations
      const object = JSON.parse(value)
      if (typeof object === 'object') {
        const oKeys = Object.keys(object)
        oKeys.forEach((k) => {
          if ((config[key][k] !== undefined))
            config[key][k] = object[k]
        })
        // config[key] = object
        break
      }
      throw new Error(i18n.utils.not_supported_configuration)
    default:
      throw new Error(i18n.utils.not_supported_configuration)
  }
}

export function makeResponse200(resp: Response | null) {
  if (resp === null)
    return new Response('NOT HANDLED', { status: 200 })

  if (resp.status === 200) {
    return resp
  }
  else {
    // 如果返回4xx，5xx，Telegram会重试这个消息，后续消息就不会到达，所有webhook的错误都返回200
    return new Response(resp.body, {
      status: 200,
      // @ts-expect-error eslint-disable-next-line
      headers: {
        'Original-Status': resp.status,
        ...resp.headers,
      },
    })
  }
}
