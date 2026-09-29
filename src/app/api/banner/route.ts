import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateBanner } from "@/lib/banner-validation";

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const result = validateBanner(raw);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const id = typeof raw.id === "string" ? raw.id : null;
  const saved = id
    ? await prisma.globalBanner.update({ where: { id }, data: result.data })
    : await prisma.globalBanner.create({ data: result.data });
  return NextResponse.json(saved);
}
