export interface ProgressState {
  current: number
  total: number
  status: string
}

export interface GalleryItem {
  id: number
  name: string
  src: string
}

export const EXT_MAP: Record<string, string> = {
  cpp: "cpp",
  h: "cpp",
  hpp: "cpp",
  js: "javascript",
  ts: "javascript",
  py: "python",
  html: "html",
  css: "css",
  json: "json",
}
