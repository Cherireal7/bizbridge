import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { Skeleton } from '@/components/ui/skeleton'

export default function SectorsLoading() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-14 sm:py-20">
          <div className="max-w-2xl">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-10 w-3/4 sm:h-14" />
            <Skeleton className="mt-4 h-5 w-full max-w-xl" />
            <Skeleton className="mt-2 h-5 w-2/3" />
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-full" />
            ))}
          </div>
          <Skeleton className="mt-6 h-11 w-full max-w-md rounded-md" />
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="mt-3 h-5 w-3/4" />
              <Skeleton className="mt-1.5 h-3 w-1/2" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
