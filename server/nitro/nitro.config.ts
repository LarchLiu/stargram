import { defineNitroConfig } from 'nitropack/config'

// import { visualizer } from 'rollup-plugin-visualizer'

// import vue from '@vitejs/plugin-vue'

// const envVars = [
//   'SUPABASE_URL', 'SUPABASE_STORAGE_BUCKET', 'SUPABASE_OG_IMAGE', 'SUPABASE_ANON_KEY',
//   'KV_URL', 'KV_REST_API_URL', 'KV_REST_API_TOKEN', 'KV_REST_API_READ_ONLY_TOKEN',
// ]

export default defineNitroConfig({
  esbuild: {
    options: {
      target: 'esnext',
    },
  },
  // storage: {
  //   data: { driver: 'vercelKV' },
  // },
  // for deno
  rollupConfig: {
    plugins: [
      // vue(),
      // visualizer({
      //   emitFile: true,
      //   filename: 'stats.html',
      // }),
      // replace({
      //   preventAssignment: true,
      //   values: {
      //     ...Object.fromEntries(
      //       envVars.map(key => [
      //       `process.env.${key}`,
      //       `Deno.env.get('${key}')`,
      //       ]),
      //     ),
      //   },
      // }),
    ],
  },
})
