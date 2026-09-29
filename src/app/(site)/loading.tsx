/** Shown instantly while the next page renders, so clicks never feel dead. Header/footer stay put. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16" role="status" aria-label="Loading">
      <div className="motion-safe:animate-pulse space-y-6">
        <div className="mx-auto h-14 w-2/3 max-w-md rounded-full bg-ds-cream-2" />
        <div className="mx-auto h-4 w-1/2 max-w-sm rounded-full bg-ds-cream-2" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="h-56 rounded-3xl bg-ds-cream-2/80" />
          <div className="h-56 rounded-3xl bg-ds-cream-2/80" />
        </div>
      </div>
    </div>
  );
}
