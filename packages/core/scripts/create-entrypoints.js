// https://github.com/hwchase17/langchainjs/blob/main/langchain/scripts/create-entrypoints.js

import * as fs from 'node:fs'
import * as path from 'node:path'

// This lists all the entrypoints for the library. Each key corresponds to an
// importable path, eg. `import { AgentExecutor } from "langchain/agents"`.
// The value is the path to the file in `src/` that exports the entrypoint.
// This is used to generate the `exports` field in package.json.
// Order is not important.
export const entrypoints = {
  'chain': 'chain/index',
  'chain/saveWebInfo': 'chain/saveWebInfo',
  'llm': 'llm/index',
  'llm/openai': 'llm/openai/index',
  'storage': 'storage/index',
  'storage/notion': 'storage/notion/index',
  'storage/supabase': 'storage/supabase/index',
  'utils': 'utils/index',
  'webCard': 'webCard/index',
  'webInfo': 'webInfo/index',
}

// Entrypoints in this list will
// 1. Be excluded from the documentation
// 2. Be only available in Node.js environments (for backwards compatibility)
// const deprecatedNodeOnly = [
//   'embeddings',
//   'llms',
//   'chat_models',
//   'vectorstores',
//   'retrievers',
//   'document_loaders',
// ]

// Entrypoints in this list require an optional dependency to be installed.
// Therefore they are not tested in the generated test-exports-* packages.
// const requiresOptionalDependency = [
//   'agents/load',
//   'tools/aws_lambda',
//   'tools/calculator',
//   'tools/webbrowser',
// ]

// List of test-exports-* packages which we use to test that the exports field
// works correctly across different JS environments.
// Each entry is a tuple of [package name, import statement].
// const testExports = [
//   [
//     'test-exports-esm',
//     p => `import * as ${p.replace(/\//g, '_')} from "langchain/${p}";`,
//   ],
//   [
//     'test-exports-esbuild',
//     p => `import * as ${p.replace(/\//g, '_')} from "langchain/${p}";`,
//   ],
//   [
//     'test-exports-cjs',
//     p => `const ${p.replace(/\//g, '_')} = require("langchain/${p}");`,
//   ],
//   ['test-exports-cf', p => `export * from "langchain/${p}";`],
//   ['test-exports-cra', p => `export * from "langchain/${p}";`],
//   ['test-exports-vercel', p => `export * from "langchain/${p}";`],
//   ['test-exports-vite', p => `export * from "langchain/${p}";`],
// ]

function updateJsonFile(relativePath, updateFunction) {
  const contents = fs.readFileSync(relativePath).toString()
  const res = updateFunction(JSON.parse(contents))
  fs.writeFileSync(relativePath, `${JSON.stringify(res, null, 2)}\n`)
}

function generateFiles() {
  const files = [...Object.entries(entrypoints), ['index', 'index']].flatMap(
    ([key, value]) => {
      const nrOfDots = key.split('/').length - 1
      const relativePath = '../'.repeat(nrOfDots) || './'
      const compiledPath = `${relativePath}dist/${value}`
      return [
        [
          `${key}.cjs`,
          `module.exports = require('${relativePath}dist/${value}.cjs')\n`,
        ],
        [`${key}.js`, `export * from '${compiledPath}.js'\n`],
        [`${key}.d.ts`, `export * from '${compiledPath}.d.ts'`],
      ]
    },
  )

  return Object.fromEntries(files)
}

function updateConfig() {
  // Update tsconfig.json `typedocOptions.entryPoints` field
  // updateJsonFile('./tsconfig.json', json => ({
  //   ...json,
  //   typedocOptions: {
  //     ...json.typedocOptions,
  //     entryPoints: [...Object.keys(entrypoints)]
  //       .filter(key => !deprecatedNodeOnly.includes(key))
  //       .map(key => `src/${entrypoints[key]}.ts`),
  //   },
  // }))

  const generatedFiles = generateFiles()
  const filenames = Object.keys(generatedFiles)

  // Update package.json `exports` and `files` fields
  updateJsonFile('./package.json', json => ({
    ...json,
    exports: Object.assign(
      Object.fromEntries(
        ['index', ...Object.keys(entrypoints)].map((key) => {
          const entryPoint = {
            types: `./${key}.d.ts`,
            require: `./${key}.cjs`,
            import: `./${key}.js`,
          }

          // if (deprecatedNodeOnly.includes(key)) {
          //   entryPoint = {
          //     node: entryPoint,
          //   }
          // }

          return [key === 'index' ? '.' : `./${key}`, entryPoint]
        }),
      ),
      { './package.json': './package.json' },
    ),
    files: ['dist/', ...filenames],
  }))

  // Write generated files
  Object.entries(generatedFiles).forEach(([filename, content]) => {
    fs.mkdirSync(path.dirname(filename), { recursive: true })
    fs.writeFileSync(filename, content)
  })

  // Update .gitignore
  fs.writeFileSync('./.gitignore', `${filenames.join('\n')}\n`)

  // Update test-exports-*/entrypoints.js
  // const entrypointsToTest = Object.keys(entrypoints)
  //   .filter(key => !deprecatedNodeOnly.includes(key))
  //   .filter(key => !requiresOptionalDependency.includes(key))
  // testExports.forEach(([pkg, importStatement]) => {
  //   const contents
  //     = `${entrypointsToTest.map(key => importStatement(key)).join('\n')}\n`
  //   fs.writeFileSync(`../${pkg}/src/entrypoints.js`, contents)
  // })
}

function cleanGenerated() {
  const filenames = Object.keys(generateFiles())
  filenames.forEach((fname) => {
    try {
      fs.unlinkSync(fname)
    }
    catch {
      // ignore error
    }
  })
}

const command = process.argv[2]

if (command === 'clean')
  cleanGenerated()

else
  updateConfig()
