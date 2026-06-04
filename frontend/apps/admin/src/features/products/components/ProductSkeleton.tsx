import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/index";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardHeader>
        <div className="h-6 w-3/4 bg-muted rounded-full animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-full bg-muted rounded-full animate-pulse" />
        <div className="h-4 w-2/3 bg-muted rounded-full animate-pulse" />
        <div className="h-7 w-1/3 bg-muted rounded-full animate-pulse mt-4" />
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full bg-muted rounded-full animate-pulse" />
      </CardFooter>
    </Card>
  );
}
