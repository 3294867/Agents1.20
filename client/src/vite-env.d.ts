/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VITE_EXPRESS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}