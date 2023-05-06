import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getFontsData } from './fonts'

export const config = {
  runtime: 'edge',
}

const SUPABASE_URL = process.env.SUPABASE_URL
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/pics-bed`

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return new Response(null, { status: 404, statusText: 'Not Found' })

  try {
    const fontsData = await getFontsData()
    const json = await req.json()
    const username = json.username
    const reponame = json.reponame
    const description = json.description
    const stargazers_count = json.stargazers_count
    const issues = json.issues
    const forks = json.forks
    const language = json.language
    let generatedImage: any

    if (!username || !reponame) {
      const storageResponse = await fetch(`${STORAGE_URL}/star-nexus.png?v=3`)
      if (storageResponse.ok) {
        return new Response(JSON.stringify({ url: `${STORAGE_URL}/star-nexus.png?v=3` }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        })
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
        <div style={{ display: 'flex', flexDirection: 'column', color: '#0969da' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{username}/{reponame}</span>
            <img
              alt="avatar"
              width="200"
              height="200"
              src={`https://github.com/${username}.png`}
              style={{
                borderRadius: 128,
              }}
            />
          </div>

          <div style={{ display: 'flex', color: 'black', fontSize: 30, paddingTop: 30 }}>
            {description}
          </div>
        </div>
        <div style={{ fontSize: '24px', color: '#586069', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '36px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '24px', background: 'green', height: '24px', borderRadius: 12, marginRight: 4 }}> &nbsp; </span>
            <span>{language}</span>
          </div>
          <div style={{ alignItems: 'center', marginRight: '36px', display: 'flex' }}>
            <svg style={{ fill: '#586069' }} aria-label="stars" viewBox="0 0 16 16" version="1.1" width="24" height="24" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
            &nbsp; <span style={{ marginLeft: '4px' }}>{stargazers_count} Stars</span>
          </div>
          <div style={{ alignItems: 'center', marginRight: '36px', display: 'flex' }}>
            <svg style={{ fill: '#586069' }} aria-label="fork" viewBox="0 0 16 16" version="1.1" width="24" height="24" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
            &nbsp; <span style={{ marginLeft: '4px' }}>{forks} Forks</span>
          </div>

          <div style={{ alignItems: 'center', marginRight: '36px', display: 'flex' }}>
            <svg aria-hidden="true" height="24" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
            </svg>
              &nbsp; <span style={{ marginLeft: '4px' }}>{issues} Open issues</span>
          </div>
          </div>
          <div style={{ display: 'flex' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16"><path fill="currentColor" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27c-.68 0-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>
          </div>
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
    )

    const imagePath = `github/${username}/${reponame}.png`
    // Upload image to storage.
    if (generatedImage?.body) {
      const storageResponse = await fetch(`${STORAGE_URL}/${imagePath}?v=starnexus`)
      if (storageResponse.ok) {
        const { error } = await supabaseAdminClient.storage
          .from('pics-bed')
          .update(imagePath, generatedImage.body, {
            contentType: 'image/png',
            cacheControl: '31536000',
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
            cacheControl: '31536000',
            upsert: false,
          })

        if (error)
          throw error
      }

      return new Response(JSON.stringify({ url: `${STORAGE_URL}/${imagePath}?v=starnexus` }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }
    else {
      return new Response(JSON.stringify({ url: `${STORAGE_URL}/star-nexus.png?v=3` }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}
