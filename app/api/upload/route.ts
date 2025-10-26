import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Buffer } from "node:buffer";
import { authOptions } from "../auth/[...nextauth]/route";
import { createR2Client, requiredR2Bucket } from "./r2Client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderPrefix = (formData.get("prefix") as string | null) || "";

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "未找到文件" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safePrefix = folderPrefix.trim().replace(/^\/+|\/+$|\s+/g, "");
    const objectKey = safePrefix ? `${safePrefix}/${file.name}` : file.name;

    const client = createR2Client();
    const bucket = requiredR2Bucket();

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        Metadata: {
          uploader: session.user?.email ?? "unknown",
          uploadedAt: new Date().toISOString(),
        },
      })
    );

    return NextResponse.json(
      {
        success: true,
        key: objectKey,
        bucket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("R2 upload error", error);
    const message = resolveR2ErrorMessage(error, "无法上传文件，请稍后重试");

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? "25");
    const maxKeys = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 25;

    const client = createR2Client();
    const bucket = requiredR2Bucket();

    const result = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix || undefined,
        MaxKeys: maxKeys,
      })
    );

    const items = (result.Contents ?? [])
      .filter((object) => Boolean(object.Key))
      .map((object) => ({
        key: object.Key as string,
        size: object.Size ?? 0,
        lastModified: object.LastModified?.toISOString() ?? null,
      }));

    return NextResponse.json({ items, isTruncated: Boolean(result.IsTruncated) });
  } catch (error) {
    console.error("R2 list error", error);
    const message = resolveR2ErrorMessage(error, "无法获取文件列表，请稍后重试");

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const key = typeof body?.key === "string" ? body.key : null;

    if (!key) {
      return NextResponse.json({ message: "缺少要删除的对象 Key" }, { status: 400 });
    }

    const client = createR2Client();
    const bucket = requiredR2Bucket();

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("R2 delete error", error);
    const message = resolveR2ErrorMessage(error, "无法删除该文件，请稍后重试");

    return NextResponse.json({ message }, { status: 500 });
  }
}

function resolveR2ErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "name" in error) {
    const code = (error as { code?: string }).code;
    const name = String((error as { name?: unknown }).name ?? "");

    if (code === "ETIMEDOUT" || name === "TimeoutError") {
      return "连接 Cloudflare R2 超时，请检查网络或访问密钥配置";
    }
  }

  if (error instanceof Error) {
    const trimmed = error.message?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return fallback;
}
