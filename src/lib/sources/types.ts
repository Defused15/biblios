export interface SearchParams {
  q: string
  lang?: string
  ext?: string
  page?: number
}

export interface BookResult {
  md5: string
  title: string
  author: string
  year?: string
  language?: string
  extension: string
  sizeBytes?: number
  coverUrl?: string
  publisher?: string
  isbn?: string
  pages?: string
}

export interface BookDetail extends BookResult {
  synopsis?: string
  hdCoverUrl?: string
  subjects?: string[]
}

export interface DownloadLink {
  url: string
  filename: string
  sizeBytes?: number
}

export interface BookSource {
  search(params: SearchParams): Promise<BookResult[]>
  resolveDownload(md5: string, ext: string): Promise<DownloadLink>
}
