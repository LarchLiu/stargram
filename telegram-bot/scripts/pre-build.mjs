import path from 'node:path'
import { $, cd, fs } from 'zx'

try {
  const timestamp = Math.floor(Date.now() / 1000)
  const commitHash = await $`git rev-parse --short HEAD`
  const sha = commitHash.stdout.trim()
  const buildInfo = { sha, timestamp }

  cd(path.resolve(__dirname, '..'))
  await fs.remove('.env')
  await $`echo 'VITE_TIMESTAMP=${timestamp}\nVITE_VERSION=${commitHash}' > .env`

  await $`echo ${timestamp} > timestamp`
  await $`echo ${JSON.stringify(buildInfo)} > buildinfo.json`
}
catch (e) {
  console.error(e)
}
