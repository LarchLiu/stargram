import Head from 'next/head'

export default function Page() {
  return (
    <div>
      <Head>
        <meta name="og:title" content="StarNexus" />
        <meta name="og:description" content="Manage all your Starred pages" />
      </Head>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1>StarNexus</h1>
      </div>
    </div>
  )
}
