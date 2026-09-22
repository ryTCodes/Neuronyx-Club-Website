import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file was attached" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "application/octet-stream";
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error: unknown) {
    console.error("Form upload API error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process upload" },
      { status: 500 }
    );
  }
}

