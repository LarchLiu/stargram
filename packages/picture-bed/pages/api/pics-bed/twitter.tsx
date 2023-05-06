import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ImageResponse } from '@vercel/og'
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const SUPABASE_URL = process.env.SUPABASE_URL
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/pics-bed`
const NotoSansJPData = fs.readFile(
  path.join(fileURLToPath(import.meta.url), '../../../../assets/NotoSansJP-Regular.ttf'),
)
const NotoSansSCData = fs.readFile(
  path.join(fileURLToPath(import.meta.url), '../../../../assets/NotoSansSC-Regular.otf'),
)
const UnifontData = fs.readFile(
  path.join(fileURLToPath(import.meta.url), '../../../../assets/unifont-15.0.01.otf'),
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(404)

  try {
    const json = req.body
    const NotoSansSC = await NotoSansJPData
    const NotoSansJP = await NotoSansSCData
    const Unifont = await UnifontData

    const fonts = [
      {
        name: 'Noto Sans SC',
        data: NotoSansSC,
        style: 'normal' as const,
      },
      {
        name: 'Noto Sans JP',
        data: NotoSansJP,
        style: 'normal' as const,
      },
      {
        name: 'Unifont',
        data: Unifont,
        style: 'normal' as const,
      },
    ]
    const fontsData = fonts
    const name = json.name
    const screenName = json.screenName
    const avator = json.avator
    const content = json.content
    const status = json.status
    const pubTime = json.pubTime
    let generatedImage: any

    if (!name || !screenName) {
      const storageResponse = await fetch(`${STORAGE_URL}/star-nexus.png?v=3`)
      if (storageResponse.ok) {
        return res.json({ url: `${STORAGE_URL}/star-nexus.png?v=3` })
      }
      else {
        generatedImage = new ImageResponse(<div
          style={{
            fontSize: 60,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <p>StarNexus</p>
        </div>, {
          width: 1200,
          height: 630,
        })
      }
    }
    else {
      // const storageResponse = await fetch(`${STORAGE_URL}/github/${username}/${reponame}.png?v=3`)
      // if (storageResponse.ok)
      //   return storageResponse

      generatedImage = new ImageResponse(<div
          style={{
            fontSize: 60,
            fontFamily: '"Noto Sans SC", "Noto Sans JP", Unifont',
            background: 'white',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            display: 'flex',
            padding: 60,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                alt="avatar"
                width="120"
                height="120"
                src={avator}
                style={{
                  borderRadius: 128,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, fontSize: 40 }}>
                <span>{name}</span>
                <span>{`@${screenName}`}</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 30,
              paddingTop: 30,
              height: 320,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}>
              {content.split('\n').filter((l: string) => l !== '').map((l: string, i: number) =>
                i < 7 ? <div style={{ display: 'flex' }} key={i}>{l}</div> : '...')}
            </div>
          </div>
          <div style={{ fontSize: '24px', color: '#586069', display: 'flex', justifyContent: 'space-between' }}>
            <span>{pubTime}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M23.953 4.57a10 10 0 0 1-2.825.775a4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827a4.996 4.996 0 0 1-2.212.085a4.936 4.936 0 0 0 4.604 3.417a9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985c0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/></svg>
          </div>
        </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          'content-type': 'image/png',
        },
        fonts: fontsData,
      },
      )
    }

    const supabaseAdminClient = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? '',
      {
        global: {
          fetch: (input, init) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return fetch(input, { ...init, duplex: 'half' })
          },
        },
      },
    )
    const imagePath = `twitter/${screenName}/${status}.png`

    // Upload image to storage.
    if (generatedImage?.body) {
      const storageResponse = await fetch(`${STORAGE_URL}/${imagePath}?v=starnexus`)
      if (storageResponse.ok) {
        const { error } = await supabaseAdminClient.storage
          .from('pics-bed')
          .update(imagePath, generatedImage.body, {
            contentType: 'image/png',
            cacheControl: '86400',
            upsert: false,
          })

        if (error)
          throw error
      }
      else {
        const { error } = await supabaseAdminClient.storage
          .from('pics-bed')
          .upload(imagePath, generatedImage.body, {
            contentType: 'image/png',
            cacheControl: '86400',
            upsert: false,
          })

        if (error)
          throw error
      }

      return res.json({ url: `${STORAGE_URL}/${imagePath}?v=starnexus` })
    }
    else {
      return res.json({ url: `${STORAGE_URL}/star-nexus.png?v=3` })
    }
  }
  catch (error) {
    res.status(400)
    return res.json({ error: error.message })
  }
}
