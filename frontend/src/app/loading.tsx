function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-border ${className ?? ''}`} />
}

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="hidden md:flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-lg" />
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <Skeleton className="md:hidden w-9 h-9 rounded-lg" />
      </header>

      <section className="min-h-[60vh] bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center p-4 lg:p-6">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 sm:h-14 lg:h-16 w-72 sm:w-96 lg:w-[500px]" />
          <Skeleton className="h-5 w-64 sm:w-80" />
          <Skeleton className="h-16 w-full max-w-xl rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-44 mb-1" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
              <Skeleton className="h-44 w-full" />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-end justify-between pt-2 border-t border-border">
                  <div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-3 w-14 mt-1" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                {i === 0 && <Skeleton className="h-8 w-32" />}
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
