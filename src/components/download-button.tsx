'use client'

import { useState } from 'react'
import { Download, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SizeWarning } from '@/components/size-warning'

type DownloadState = 'idle' | 'loading' | 'done' | 'error'

interface DownloadButtonProps {
  md5: string
  ext: string
  filename: string
}

export function DownloadButton({ md5, ext, filename }: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>('idle')
  const [warning, setWarning] = useState<{ sizeBytes: number; fallbackUrl: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleDownload() {
    setState('loading')
    setWarning(null)
    setErrorMsg(null)

    try {
      const res = await fetch(`/api/download?md5=${encodeURIComponent(md5)}&ext=${encodeURIComponent(ext)}`)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const contentType = res.headers.get('content-type') ?? ''

      if (contentType.includes('application/json')) {
        const data = await res.json()
        if (data.warning) {
          setWarning({ sizeBytes: data.sizeBytes, fallbackUrl: data.fallbackUrl })
          setState('idle')
          return
        }
        throw new Error(data.error ?? 'Unknown error')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setState('done')
      setTimeout(() => setState('idle'), 3000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Download failed')
      setState('error')
    }
  }

  const icons = {
    idle: <Download className="h-4 w-4" />,
    loading: <Loader2 className="h-4 w-4 animate-spin" />,
    done: <Check className="h-4 w-4" />,
    error: <X className="h-4 w-4" />,
  }

  const labels = {
    idle: 'Download',
    loading: 'Loading…',
    done: 'Done',
    error: 'Retry',
  }

  const variants: Record<DownloadState, string> = {
    idle: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
    loading: 'bg-zinc-700 text-zinc-300 cursor-not-allowed',
    done: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    error: 'bg-red-600 hover:bg-red-500 text-white',
  }

  return (
    <div className="flex flex-col gap-2">
      {warning && (
        <SizeWarning sizeBytes={warning.sizeBytes} fallbackUrl={warning.fallbackUrl} />
      )}
      {state === 'error' && errorMsg && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
      <Button
        onClick={state === 'error' ? handleDownload : state === 'idle' ? handleDownload : undefined}
        disabled={state === 'loading'}
        className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${variants[state]}`}
        size="sm"
      >
        {icons[state]}
        {labels[state]}
      </Button>
    </div>
  )
}
