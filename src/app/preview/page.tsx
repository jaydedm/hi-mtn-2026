import Link from "next/link";
import { DIRECTIONS } from "./_shared/directions";

export default function PreviewIndex() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-20 font-sans">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Hi-Mountain</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Redesign prototypes</h1>
        <p className="mt-3 text-zinc-400">
          Three clickable proof-of-concept directions using the real menu, hours, and archive photos.
          Nothing here is linked from the live site.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {DIRECTIONS.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/preview/${d.slug}`}
                className="block rounded-2xl border border-white/10 bg-zinc-900 p-5 hover:border-amber-400/60 hover:bg-zinc-800 transition"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-sm font-black text-zinc-900">
                  {d.letter}
                </span>
                <span className="mt-4 block text-lg font-bold">{d.name}</span>
                <span className="block text-sm text-zinc-400">{d.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
