"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 定义文件对象的类型
interface FileItem {
  key: string;
  filename: string;
  size: number;
  lastModified: string;
}

export default function FileItem() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 状态管理
  const [files, setFiles] = useState<FileItem[]>([]); // 存储文件列表，初始值为空数组
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 下载和删除状态管理
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  // 获取文件列表
  useEffect(() => {
    // useEffect 在组件加载时获取文件列表，当status 和 router 变化时，重新执行
    if (status === "authenticated") {
      // 获取文件列表
      const fetchFiles = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch("/api/files");
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "获取文件列表失败");
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
    }
  }, [status, router]);
  // 结束useEffect()

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <a className="text-lg text-gray-500 ">加载中 </a>
        <span className="loading loading-spinner text-neutral"></span>
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

  // 格式化文件大小，因为文件size 返回的是 bytes
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // 处理下载
  const handleDownload = async (key: string, filename: string) => {
    setDownloadingKey(key);
    setError(null);

    try {
      //调用 下载链接
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`无法获取下载链接: ${error.message}`);
      }

      const { url } = await response.json();
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("下载失败");
      setError(error.error);
    } finally {
      setIsLoading(false);
      setDownloadingKey(null); //清理下载状态
    }
  };

  // 处理删除
  const handleDelete = async (key: string) => {
    setDeletingKey(key);
    setError(null);

    try {
      // 调用 删除api
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`删除文件失败: ${error.message}`);
      }
      // 从 UI 实时移除文件
      setFiles((prevFiles) => prevFiles.filter((file) => file.key !== key));
    } catch (error: any) {}
  };

  // --- 主界面渲染开始 ---
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800"> 我的文件</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus: outline-none focus:ring-2 focus:ring-indigo-500"
          >
            返回上传
          </Link>
        </div>

        {/* 根据不同状态显示内容 */}
        {isLoading && <p>正在加载文件列表</p>}
        {error && <p className="text-red-600">错误: {error}</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                  >
                    文件名
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                  >
                    大小
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                  >
                    最后修改
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.length > 0 ? (
                  files.map((file) => (
                    <tr key={file.key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {file.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatBytes(file.size)}
                        {/* 使用格式化后的文件大小 */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.lastModified).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              handleDownload(file.key, file.filename)
                            }
                            disabled={
                              downloadingKey === file.key ||
                              deletingKey === file.key
                            }
                            className="cursor-pointer text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-wait"
                          >
                            {downloadingKey === file.key ? "下载中..." : "下载"}
                          </button>
                          <button
                            onClick={() => handleDelete(file.key)}
                            disabled={
                              deletingKey === file.key ||
                              downloadingKey === file.key
                            }
                            className="cursor-pointer text-red-500 hover:text-red-900 disabled:text-gray-400 disabled:cursor-wait"
                          >
                            {deletingKey === file.key ? "删除中..." : "删除"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      你还没有上传任何文件
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
  // --- 主界面渲染结束 ---
}
