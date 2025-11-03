// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
// import { ListObjectsV2Command } from "@aws-sdk/client-s3";
// import { s3Client, R2_BUCKET_NAME } from "@/lib/r2";
// import { authOptions } from "../auth/[...nextauth]/route";

// export async function GET(request: Request) {
//   // 获取当前session
//   try {
//     let session = await getServerSession(authOptions);
//     if (!session || session.user?.email) {
//       return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
//     }

//     // 构建用户文件夹路径
//   } catch (error: any) {}
// }

// 函数 GET(request):
//   尝试:
//     # 1. 验证用户登录
//     获取当前会话(session)
//     如果 session 不存在 或者 session.user.email 不存在:
//       返回 JSON { error: "未授权，请先登录" }, 状态码 401

//     # 2. 构造用户文件夹路径
//     用户前缀 = "uploads/" + session.user.email + "/"

//     # 3. 创建列出对象的命令
//     创建 ListObjectsV2Command:
//       - Bucket: R2_BUCKET_NAME
//       - Prefix: 用户前缀
//       - MaxKeys: 1000

//     # 4. 执行命令获取文件列表
//     响应 = 发送命令到 s3Client

//     # 5. 提取并格式化文件信息
//     文件列表 = 空数组
//     对于 响应.Contents 中的每个 item:
//       添加到文件列表:
//         - key: item.Key (完整路径)
//         - filename: 从 item.Key 中提取最后一段(文件名)
//         - size: item.Size (字节)
//         - lastModified: item.LastModified (时间)
//         - etag: item.ETag (可选)

//     # 6. 返回结果
//     返回 JSON:
//       - files: 文件列表
//       - count: 文件数量
//       - userEmail: session.user.email
//     状态码 200

//   捕获错误:
//     打印错误到控制台
//     返回 JSON { error: "服务器内部错误" }, 状态码 500
