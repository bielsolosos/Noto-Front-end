export function ContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-8 animate-pulse">
      <div className="mb-8">
        <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/6"></div>

        <div className="h-32 bg-muted rounded w-full mt-8"></div>

        <div className="space-y-2 mt-6">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}
