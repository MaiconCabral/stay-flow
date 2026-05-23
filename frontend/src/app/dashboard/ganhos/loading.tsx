function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-border ${className ?? ''}`} />
}

export default function GanhosLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-24 mb-1" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-14 h-5 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-[220px] w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
