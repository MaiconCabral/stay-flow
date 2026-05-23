function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-border ${className ?? ''}`} />
}

export default function MensagensLoading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 lg:gap-0">
      <div className="w-full lg:w-[340px] xl:w-[380px] border-r border-border bg-card rounded-xl lg:rounded-r-none border overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-5 w-28 mb-3" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex-1 space-y-1 p-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-card rounded-xl rounded-l-none border border-l-0 flex-col">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <Skeleton className={`h-12 ${i % 2 === 0 ? 'w-56' : 'w-44'} rounded-2xl`} />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
