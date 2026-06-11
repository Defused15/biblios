import { Skeleton } from '@/components/ui/skeleton'

export function BookSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      {/* Cover */}
      <Skeleton className="h-[135px] w-[90px] shrink-0 rounded bg-zinc-800" />

      {/* Metadata */}
      <div className="flex flex-1 flex-col gap-2 py-1">
        <Skeleton className="h-5 w-3/4 rounded bg-zinc-800" />
        <Skeleton className="h-4 w-1/2 rounded bg-zinc-800" />
        <Skeleton className="h-3 w-1/3 rounded bg-zinc-800" />
        <div className="mt-auto flex items-center gap-2">
          <Skeleton className="h-5 w-12 rounded bg-zinc-800" />
          <Skeleton className="ml-auto h-8 w-8 rounded bg-zinc-800" />
          <Skeleton className="h-8 w-24 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}
