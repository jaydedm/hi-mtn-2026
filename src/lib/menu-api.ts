import { TAGS, expire } from "@/lib/cache-tags";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { loadMenu } from "@/lib/menu-data";

/** 401 response if the request isn't from a signed-in admin, else null. */
export async function requireAdmin() {
  const { userId } = await auth();
  return userId ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });
export const notFound = () => NextResponse.json({ error: "Not found" }, { status: 404 });

/** Reads a JSON body, or null if it isn't valid JSON. */
export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/** Every mutation responds with the whole menu so the editor can resync in one step. */
export async function menuResponse(status = 200) {
  expire(TAGS.menu);
  return NextResponse.json({ sections: await loadMenu() }, { status });
}

export const optionRows = (options: { label: string; priceCents: number; isAddOn: boolean }[]) =>
  options.map((o, sortOrder) => ({ ...o, sortOrder }));
