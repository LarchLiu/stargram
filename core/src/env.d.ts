/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PICTURE_BED: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
