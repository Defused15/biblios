import { AlertTriangle } from 'lucide-react'

interface SizeWarningProps {
  sizeBytes: number
  fallbackUrl: string
}

export function SizeWarning({ sizeBytes, fallbackUrl }: SizeWarningProps) {
  const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(1)

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <div className="flex flex-col gap-1">
        <p className="font-medium text-amber-300">Archivo grande ({sizeMb} MB)</p>
        <p className="text-amber-400/70">
          La descarga en streaming puede fallar con archivos de este tamaño.{' '}
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-amber-300 transition-colors"
          >
            Descarga directamente
          </a>{' '}
          desde el servidor de origen.
        </p>
      </div>
    </div>
  )
}
