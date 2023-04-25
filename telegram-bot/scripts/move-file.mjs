import path from 'node:path'
import { cd, fs } from 'zx'

try {
  cd(path.resolve(__dirname, '..'))
  fs.move('timestamp', './dist/timestamp')
  fs.move('buildinfo.json', './dist/buildinfo.json')
}
catch (e) {
  console.error(e)
}
