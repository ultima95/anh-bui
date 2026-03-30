import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { uploadToS3, isS3Configured } from "@/src/lib/s3";
import { randomUUID } from "node:crypto";
import path from "node:path";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isS3Configured()) {
    return NextResponse.json({ error: "S3 is not configured on this server." }, { status: 503 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF files are allowed." }, { status: 400 });
  }

  const maxBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "File must be under 5 MB." }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const key = `projects/${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await uploadToS3(key, buffer, file.type);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[upload] S3 upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Check S3 configuration." }, { status: 500 });
  }
}
