function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-border ${className ?? ''}`} />
}

export default function ConfiguracoesLoading() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-6 w-36 mb-1" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex gap-1 pb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-lg" />
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
