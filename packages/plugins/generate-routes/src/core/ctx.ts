import { dirname, isAbsolute, parse as parsePath, relative, resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { slash, throttle, toArray } from '@antfu/utils'
import type { Import } from 'unimport'
import { createUnimport, scanDirExports } from 'unimport'
import { camelCase, upperFirst } from 'scule'
import type { ImportExtended, Options } from '../types'

const defaultRoutesExportPath = 'src/routes-auto-generate.ts'

function camelCaseWithoutAt(str: string) {
  return camelCase(str.replaceAll('@', '').replaceAll('.', ''))
}

export function createContext(options: Options = {}, root = process.cwd()) {
  const imports = flattenImports(options.imports, options.overriding)

  const dirs = options.dirs?.map(dir => resolve(root, dir))

  const routesImport = createUnimport({
    imports,
  })

  const routesExportPath = resolve(root, options.routesExportPath ?? defaultRoutesExportPath)

  function resolvePath(file: string, i: Import) {
    const dir = dirname(file)
    if (i.from.startsWith('.') || isAbsolute(i.from)) {
      const related = slash(relative(dir, i.from).replace(/\.ts$/, ''))
      return !related.startsWith('.')
        ? `./${related}`
        : related
    }
    return i.from
  }

  async function generateRoutesExport() {
    let str = '// Auto Generated by \'@starnexus/generate-routes\'\nimport type { Routes } from \'@starnexus/core\'\n'
    const imports: ImportExtended[] = await routesImport.getImports()
    const paths: Record<string, string[]> = {}

    imports.forEach((i) => {
      const from = resolvePath(routesExportPath, i)
      if (i.__source === 'router') {
        str += `import { router as ${i.as} } from '${from}'\n`
      }
      else if (i.__source === 'path') {
        const domain = i.__domain!
        if (!paths[domain])
          paths[domain] = []

        paths[domain].push(i.as!)
        str += `import { pathInfo as ${i.as} } from '${from}'\n`
      }
      else {
        str += `import { routes as ${i.as} } from '${from}'\n`
      }
    })
    str += '\n'
    Object.keys(paths).forEach((domain) => {
      str += `${domain}.paths = [\n  ${paths[domain].join(',\n  ')},\n].sort((a, b) => (b.sequence ?? 0) - (a.sequence ?? 0))\n`
    })
    str += '\n'
    let importStr = ''

    imports.sort((a, b) => (a.as!).localeCompare((b.as!))).forEach((i) => {
      if (i.__source === 'router') {
        const arr = i.from.split('/')
        const dir = arr[arr.length - 2]

        importStr += `  '${dir}': ${i.as},\n`
      }
      else if (i.__source === 'resolver') {
        importStr += `  ...${i.as},\n`
      }
    })

    const importObj = `export const routes: Routes = {\n${importStr}}\n`
    return str + importObj
  }

  const writeRoutesFilesThrottled = throttle(500, writeRoutesFiles, { noLeading: false })

  let lastImport: string | undefined

  async function writeRoutesFiles() {
    const promises: any[] = []
    if (routesExportPath) {
      const content = await generateRoutesExport()
      if (content !== lastImport) {
        lastImport = content
        promises.push(fs.writeFile(routesExportPath, content, 'utf-8'))
      }
    }
    return Promise.all(promises)
  }

  async function scanDirs() {
    if (dirs?.length) {
      await routesImport.modifyDynamicImports(async (imports) => {
        const _exports = (await scanDirExports(dirs, { fileFilter: options.fileFilter ? options.fileFilter : () => true }) as ImportExtended[])
          .filter(i => i.name === 'router' || i.name === 'pathInfo')

        _exports.forEach((i) => {
          const filepath = i.from
          let name = i.name
          if (name === 'router') {
            const arr = filepath.split('/')
            name = arr[arr.length - 2]
            i.as = camelCaseWithoutAt(name)
            i.__source = 'router'
          }
          else {
            const arr = filepath.split('/')
            const domain = camelCaseWithoutAt(arr[arr.length - 3])
            const last = parsePath(filepath).name
            name = domain + upperFirst(last)
            i.as = camelCaseWithoutAt(name)
            i.__source = 'path'
            i.__domain = domain
          }
        })

        return [
          ...imports.filter((i: ImportExtended) => i.__source === 'resolver'),
          ..._exports,
        ] as ImportExtended[]
      })
    }
    writeRoutesFilesThrottled()
  }

  return {
    root,
    dirs,
    generateRoutesExport,
    scanDirs,
    writeRoutesFiles,
    writeRoutesFilesThrottled,
  }
}

export function flattenImports(map: Options['imports'], overriding = false): ImportExtended[] {
  const flat: Record<string, ImportExtended> = {}
  toArray(map).forEach((definition) => {
    const as = camelCaseWithoutAt(definition)
    const meta: ImportExtended = {
      name: definition,
      as,
      from: definition,
      __source: 'resolver',
    }

    if (flat[as] && !overriding)
      throw new Error(`[starnexus-import-routes] identifier ${as} already defined with ${flat[as].from}`)

    flat[as] = meta
  })

  return Object.values(flat)
}
