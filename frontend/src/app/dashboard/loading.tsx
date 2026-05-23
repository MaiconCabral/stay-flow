function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-border ${className ?? ''}`} />
}

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 min-w-[200px] flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-14 h-5 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
