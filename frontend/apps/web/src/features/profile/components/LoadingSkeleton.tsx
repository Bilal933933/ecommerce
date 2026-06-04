import { Skeleton } from "@workspace/ui/components/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
