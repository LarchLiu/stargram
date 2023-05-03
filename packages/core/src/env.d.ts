/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PICTURE_BED: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_NOTION_API_KEY: string
  readonly VITE_NOTION_DATABASE_ID: string
  readonly VITE_OPENAI_API_HOST: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
