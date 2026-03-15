import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const menus = await prisma.menuPdf.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(menus);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "PDF required" }, { status: 400 });
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${timestamp}-${safeName}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(process.cwd(), "public", "menus", filename), bytes);

  const menu = await prisma.menuPdf.create({
    data: { filename },
  });

  return NextResponse.json(menu);
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  // Deactivate all, then activate the selected one
  await prisma.menuPdf.updateMany({ data: { isActive: false } });
  const menu = await prisma.menuPdf.update({
    where: { id },
    data: { isActive: true },
  });

  return NextResponse.json(menu);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const menu = await prisma.menuPdf.delete({ where: { id } });

  // Best-effort delete the file
  const fs = await import("fs/promises");
  await fs.unlink(path.join(process.cwd(), "public", "menus", menu.filename)).catch(() => {});

  return NextResponse.json({ success: true });
}
