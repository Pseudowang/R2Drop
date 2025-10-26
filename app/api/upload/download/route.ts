import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createR2Client, requiredR2Bucket } from "../r2Client";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ message: "缺少要下载的对象 Key" }, { status: 400 });
  }

  try {
    const client = createR2Client();
    const bucket = requiredR2Bucket();

    const result = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    if (!result.Body) {
      return NextResponse.json({ message: "未找到该对象" }, { status: 404 });
    }

    const filename = key.split("/").pop() ?? key;
    const stream = typeof result.Body.transformToWebStream === "function"
      ? result.Body.transformToWebStream()
      : (result.Body as unknown as ReadableStream);

    return new Response(stream, {
      headers: {
        "Content-Type": result.ContentType ?? "application/octet-stream",
        "Content-Length": result.ContentLength?.toString() ?? undefined,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("R2 download error", error);
    const message =
      error instanceof Error ? error.message : "无法下载文件，请稍后重试";

    return NextResponse.json({ message }, { status: 500 });
  }
}
