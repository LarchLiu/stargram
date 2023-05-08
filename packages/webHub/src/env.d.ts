/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_API_HOST: string
  readonly VITE_GITHUB_RAW_HOST: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
