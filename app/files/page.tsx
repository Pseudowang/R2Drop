"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// 定义文件对象的类型
interface FileItem {
  key: string;
  filename: string;
  size: number;
  lastModified: string;
}

export default function filesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 状态管理
  const [files, setFiles] = useState<FileItem[]>([]); // 存储文件列表，初始值为空数组
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 获取文件列表
  useEffect(() => {
    // useEffect 会在组件加载后自动执行，当status 和 router 变化时，重新执行
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // 如果还在加载中，等待
    if (status === "loading") {
      return;
    }
    // 获取文件列表
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files");

        if (!response.ok) {
          throw new Error("获取文件列表失败");
        }

        const data = await response.json();
        setFiles(data.files);
      } catch (error: any) {
        console.error("获取文件列表失败: ", error);
        setError(error.message);
      } finally {
        setIsLoading(false); // 无论成功失败，都需要结束加载状态
      }
    };
    // 执行获取文件列表函数
    fetchFiles();
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-500">加载中</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">错误: {error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // --- 主界面渲染开始 ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部区域 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">我的文件</h1>
            <p className="text-sm text-gray-600 mt-1">
              当前用户: {session?.user?.email}
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            返回上传
          </button>
        </div>

        {/* 文件列表区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              文件列表 ({files.length})
            </h2>
          </div>

          {/* 如果没有文件，显示提示 */}
          {files.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-gray-500">还没有上传任何文件</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                去上传文件
              </button>
            </div>
          ) : (
            // 显示文件列表
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.key}
                  className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* 左侧：文件信息 */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{file.filename}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      大小: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  {/* 右侧：上传时间 */}
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(file.lastModified).toLocaleString("zh-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  // --- 主界面渲染结束 ---
}
