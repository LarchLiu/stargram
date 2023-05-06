import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const NotoSansJPData = fs.readFile(
  path.join(fileURLToPath(import.meta.url), '../../../assets/NotoSansJP-Regular.ttf'),
)
export const NotoSansSCData = fs.readFile(
  path.join(fileURLToPath(import.meta.url), '../../../assets/NotoSansSC-Regular.otf'),
)
export const UnifontData = fs.readFile(
  path.join(fileURLToPath(import.meta.url), '../../../assets/unifont-15.0.01.otf'),
)
