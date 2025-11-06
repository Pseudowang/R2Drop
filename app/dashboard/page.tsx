// 必须是客户端组件，因为我们需要处理文件选择和点击事件
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession(); // 解构 status 和 data， 并命名 data 为 session
  const router = useRouter();

  // setFile 不仅是设置一个值，还会触发组件重新渲染
  // 并且只存储 File 对象或者null，File 是浏览器内置的类型，表示用户选择的文件, file.name file.size file.type 等属性可用
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 接收名为e参数，类为型 React.ChangeEvent<HTMLInputElement> 的事件处理函数, 就是文件输入框的change事件
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // 如果用户选择了文件，更新状态
      setFile(e.target.files[0]);
      setMessage(""); // 清除旧消息
    }
  };

  // 描述 HTML 表单的 onSubmit 事件处理函数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表单默认提交行为, 如果没有的话浏览器会刷新页面并向服务器发送GET/POST请求，在单页应用中，这会导致页面属性，丢失状态

    if (!file) {
      setMessage("请先选择一个文件。");
      return;
    }

    setIsLoading(true);
    setMessage("正在上传...");

    try {
      // 调用我们自己的 API 来获取预签名 URL
      const presignedUrlResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!presignedUrlResponse.ok) {
        const error = await presignedUrlResponse.json();
        throw new Error(`获取 URL 失败: ${error.error}`);
      }

      const { url, key } = await presignedUrlResponse.json();

      // 通过预签名URL 直接将文件PUT
      const uploadToR2Response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadToR2Response.ok) {
        throw new Error("上传到 R2 失败。");
      }

      // 成功！
      setMessage(`文件上传成功！Key: ${key}`);
      setFile(null); // 清空文件选择
    } catch (error: any) {
      console.error("上传失败:", error);
      setMessage(`上传失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // --- 文件上传逻辑结束 ---

  // 检查登录状态
  if (status === "loading") {
    return <p>加载中...</p>;
  }

  // 如果未登录，重定向到登录页
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            欢迎, {session?.user?.email}
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            退出登录
          </button>
        </div>

        {/* --- 文件上传表单 (从组件合并回来) --- */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            上传新文件
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                选择文件
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                disabled={isLoading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !file}
              className=" cursor-pointer w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md
                hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "上传中..." : "上传"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm font-medium ${
                message.includes("失败") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* 查看文件列表按钮 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              className="cursor-pointer w-full px-4 py-3 font-semibold text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg
                hover:bg-indigo-50
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              onClick={() => router.push("/files")}
            >
              查看我的文件
            </button>
          </div>
        </div>
        {/* --- 文件上传表单结束 --- */}
      </div>
    </div>
  );
}
