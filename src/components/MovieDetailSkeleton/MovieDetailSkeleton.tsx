import { Skeleton } from "@/components/ui/skeleton";

export const MovieDetailSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-[420px] w-full rounded-none" />
      <div className="mx-auto -mt-64 max-w-7xl px-6 pb-16">
        <Skeleton className="mb-6 h-8 w-20" />
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <div className="space-y-4 pt-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>
            <Skeleton className="h-10 w-40" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailSkeleton;
