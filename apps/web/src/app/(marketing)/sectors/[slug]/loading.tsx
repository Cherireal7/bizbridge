import { Skeleton } from '@/components/ui/skeleton'

export default function SectorDetailLoading() {
  return (
    <div>
      <div className="border-b border-border">
        <div className="container-page py-4">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <section className="border-b border-border">
        <div className="container-page py-10 sm:py-14">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="mt-4 h-9 w-3/4 sm:h-12" />
          <Skeleton className="mt-2 h-5 w-1/2" />
          <Skeleton className="mt-5 h-5 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-5 w-4/5 max-w-xl" />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page py-8 sm:py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-7 w-20" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14 space-y-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-8 w-2/3" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
