import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const BUCKET = "menus";

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
  const { error } = await supabase.storage.from(BUCKET).upload(filename, bytes, {
    contentType: "application/pdf",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  const menu = await prisma.menuPdf.create({
    data: { filename, url: urlData.publicUrl },
  });

  return NextResponse.json(menu);
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
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

  // Best-effort delete from storage
  await supabase.storage.from(BUCKET).remove([menu.filename]).catch(() => {});

  return NextResponse.json({ success: true });
}
