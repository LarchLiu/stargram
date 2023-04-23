import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'

export default function Page() {
  return (
    <div>
      <Head>
        <meta name="og:title" content="StarNexus" />
        <meta name="og:description" content="Manage all your Starred pages" />
        <meta
          name="og:image"
          content={
            // Because OG images must have a absolute URL, we use the
            // `VERCEL_URL` environment variable to get the deployment’s URL.
            // More info:
            // https://vercel.com/docs/concepts/projects/environment-variables
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/vercel`
          }
        />
      </Head>
      <Analytics />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1>StarNexus</h1>
      </div>
    </div>
  )
}
