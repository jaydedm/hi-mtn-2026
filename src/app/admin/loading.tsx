/** Instant placeholder while an admin page loads; the sidebar stays interactive. */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="motion-safe:animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted" />
      </div>
      <div className="space-y-4">
        <div className="h-14 rounded-xl bg-muted" />
        <div className="h-40 rounded-xl bg-muted" />
        <div className="h-40 rounded-xl bg-muted" />
      </div>
    </div>
  );
}
