"use client";

import { useCallback, useEffect, useState } from "react";

type ListedObject = {
  key: string;
  size: number;
  lastModified: string | null;
};

interface R2ObjectListProps {
  heading?: string;
  subtitle?: string;
  refreshToken?: number;
}

export default function R2ObjectList({ heading, subtitle, refreshToken = 0 }: R2ObjectListProps) {
  const [objects, setObjects] = useState<ListedObject[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [internalRefresh, setInternalRefresh] = useState(0);

  const formatSize = (size: number) => {
    if (size === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(Math.log(size) / Math.log(1024));
    const value = size / Math.pow(1024, index);
    return `${value.toFixed(1)} ${units[index]}`;
  };

  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return "未知";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoDate));
  };

  const fetchObjects = useCallback(async () => {
    try {
      setStatus("loading");
      setMessage(null);

      const response = await fetch("/api/upload?limit=50");
      let payload: unknown;

      try {
        payload = await response.json();
      } catch (parseError) {
        throw new Error("无法解析服务器响应");
      }

      const typedPayload = payload as { message?: string; items?: ListedObject[] };

      if (!response.ok) {
        throw new Error(typedPayload.message || "无法加载文件列表");
      }

      setObjects(typedPayload.items ?? []);
      setStatus("idle");
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "加载文件列表时出现未知错误";
      setStatus("error");
      setMessage(reason);
    }
  }, []);

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects, refreshToken, internalRefresh]);

  const triggerRefresh = () => {
    setInternalRefresh((count) => count + 1);
  };

  const handleDelete = useCallback(
    async (key: string) => {
      const confirmed = window.confirm(`确定删除 ${key} 吗？`);
      if (!confirmed) {
        return;
      }

      try {
        const response = await fetch("/api/upload", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key }),
        });

        let payload: unknown;

        try {
          payload = await response.json();
        } catch (parseError) {
          throw new Error("无法解析服务器响应");
        }

        const typedPayload = payload as { message?: string };

        if (!response.ok) {
          throw new Error(typedPayload.message || "无法删除该文件");
        }

        triggerRefresh();
      } catch (error) {
        const reason = error instanceof Error ? error.message : "删除失败";
        setStatus("error");
        setMessage(reason);
      }
    },
    []
  );

  const handleDownload = useCallback((key: string) => {
    const url = `/api/upload/download?key=${encodeURIComponent(key)}`;
    window.open(url, "_blank");
  }, []);

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{heading ?? "已上传文件"}</h3>
          <p className="text-sm text-slate-400">{subtitle ?? "最新 50 条记录 · 支持下载 / 删除"}</p>
        </div>
        <button
          type="button"
          onClick={triggerRefresh}
          className="rounded-2xl border border-slate-700/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500/70 hover:text-white"
        >
          刷新列表
        </button>
      </div>

      {status === "loading" ? (
        <p className="mt-4 text-sm text-slate-400">正在加载文件列表...</p>
      ) : null}

      {status === "error" && message ? (
        <p className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {message}
        </p>
      ) : null}

      {objects.length === 0 && status !== "loading" ? (
        <p className="mt-4 text-sm text-slate-400">暂无文件，请先上传。</p>
      ) : null}

      {objects.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800/60">
          <div className="hidden grid-cols-[2fr_1fr_1fr_auto] bg-slate-900/60 px-5 py-3 text-xs uppercase tracking-widest text-slate-400 md:grid">
            <span>对象 Key</span>
            <span>大小</span>
            <span>更新时间</span>
            <span className="text-right">操作</span>
          </div>
          <ul className="divide-y divide-slate-800/60">
            {objects.map((object) => (
              <li
                key={object.key}
                className="grid grid-cols-1 gap-4 px-5 py-4 text-sm text-slate-200 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center"
              >
                <div className="break-words text-slate-100">{object.key}</div>
                <div className="text-slate-300">{formatSize(object.size)}</div>
                <div className="text-slate-400">{formatDate(object.lastModified)}</div>
                <div className="flex flex-wrap justify-start gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => handleDownload(object.key)}
                    className="rounded-2xl border border-sky-400/40 px-4 py-2 text-xs font-semibold text-sky-100 transition hover:border-sky-300/70"
                  >
                    下载
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(object.key)}
                    className="rounded-2xl border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:border-rose-400/80"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
