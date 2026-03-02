import { Skeleton } from '@/components/ui/skeleton';

export default function BusDetailLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          <div className="space-y-6">
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="grid grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="w-full aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-neutral-50 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-10 w-32 mx-auto" />
                </div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
