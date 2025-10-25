// 这是一个简单受保护页面的占位符
// 我们登录后会跳转到这里

import { getServerSession } from "next-auth/next";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // 1. 在服务端获取 session
  // 这是保护页面最安全的方式
  const session = await getServerSession(authOptions);

  // 2. 如果 session 不存在 (用户没登录)，则重定向到登录页
  if (!session) {
    redirect("/login");
  }

  // 3. 如果 session 存在，显示页面内容
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          欢迎来到仪表盘
        </h1>
        <p className="text-gray-600 mb-6">
          你已成功登录，你的邮箱是：{" "}
          <span className="font-semibold text-blue-600">
            {session.user?.email}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          （这里将是你未来的文件上传和管理界面）
        </p>
        {/* 在这里可以添加一个登出按钮，但我们稍后在实现 */}
      </div>
    </div>
  );
}
