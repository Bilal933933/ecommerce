export function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-96 bg-gradient-to-br from-blue-600 to-purple-800 animate-pulse" />
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-48 bg-muted rounded-xl animate-pulse" />
            <div className="h-48 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-muted rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
