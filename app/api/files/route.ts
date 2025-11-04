import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client, R2_BUCKET_NAME } from "@/lib/r2";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  // 获取当前session
  try {
    let session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
    }

    // 构建用户文件夹路径
    const userPrefix = `uploads/${session.user?.email}/`;
    // const userPrefix = "uploads/wang@wang.com/";

    // 创建列出对象的命令
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: userPrefix,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);

    // 提取并格式化文件信息
    const files = (response.Contents || []).map((item) => ({
      key: item.Key,
      filename: item.Key?.split("/").pop(),
      size: item.Size,
      lastModified: item.LastModified,
      etag: item.ETag,
    }));

    return NextResponse.json(
      {
        files,
        count: files.length,
        userEmail: session.user.email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("获取文件列表失败:", error);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
