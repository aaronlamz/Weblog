export default function LoadingPost() {
  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      <article className="mx-auto max-w-6xl">
        <header className="mb-12 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-3.5 w-28 bg-muted/60 rounded" />
            <div className="h-3.5 w-16 bg-muted/50 rounded" />
            <div className="h-3.5 w-20 bg-muted/50 rounded" />
          </div>
          <div className="h-8 w-2/3 bg-muted/70 rounded mb-3" />
          <div className="h-6 w-1/2 bg-muted/60 rounded" />
        </header>

        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-muted/50 rounded" />
          ))}
          <div className="h-4 w-5/6 bg-muted/50 rounded" />
          <div className="h-4 w-2/3 bg-muted/50 rounded" />
        </div>
      </article>
    </div>
  )
}


