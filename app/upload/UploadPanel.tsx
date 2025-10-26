"use client";

import { useMemo, useRef, useState } from "react";
import ConfettiBurst from "../components/ConfettiBurst";
import R2ObjectList from "../components/R2ObjectList";

type UploadPanelProps = {
  email?: string | null;
};

type UploadState = "idle" | "uploading" | "success" | "error";

export default function UploadPanel({ email }: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearFileSelection = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const previewName = useMemo(() => {
    if (!file) {
      return "选择或拖拽文件";
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return `${file.name} · ${sizeInMb} MB`;
  }, [file]);

  const resetForm = () => {
    clearFileSelection();
    setPrefix("");
    setStatus("idle");
    setMessage(null);
    setShowConfetti(false);
  };

  const onFileChange = (targetFile: File | null) => {
    setMessage(null);
    setStatus("idle");
    setShowConfetti(false);
    setFile(targetFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setStatus("error");
      setMessage("请先选择文件");
      return;
    }

    setStatus("uploading");
    setMessage("正在上传至 Cloudflare R2...");
    setShowConfetti(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (prefix.trim()) {
        formData.append("prefix", prefix.trim());
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "上传失败");
      }

      setStatus("success");
      setMessage(`上传成功！对象路径：${payload.key}`);
      setShowConfetti(true);
      clearFileSelection();
      setRefreshToken((token) => token + 1);
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "上传过程中出现未知错误";
      setStatus("error");
      setMessage(reason);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950/80 p-10 text-slate-200 shadow-[0_20px_60px_-25px_rgba(56,189,248,0.7)] ring-1 ring-slate-800/70 backdrop-blur">
      <ConfettiBurst active={showConfetti} />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-400">上传目标</p>
        <h2 className="text-3xl font-semibold text-white">Cloudflare R2 存储</h2>
        <p className="text-sm text-slate-400">
          {email ? `当前登录：${email}` : "当前会话未返回邮箱"}
        </p>
      </div>

      <form onSubmit={handleUpload} className="mt-8 space-y-6">
        <div>
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/50 p-8 text-center transition hover:border-sky-400/80 hover:bg-slate-900/70"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            />
            <div className="rounded-full bg-slate-900/80 p-4 text-sky-300 ring-1 ring-slate-800/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-10 w-10"
              >
                <path d="M11.25 3a.75.75 0 0 1 1.5 0v9.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47zm-5 10a.75.75 0 0 1 .75.75v3.5h10v-3.5a.75.75 0 0 1 1.5 0v3.5A2.75 2.75 0 0 1 15.75 20h-7.5A2.75 2.75 0 0 1 5.5 17.25v-3.5a.75.75 0 0 1 .75-.75z" />
              </svg>
            </div>
            <div>
              <p className="text-lg text-white">{previewName}</p>
              <p className="mt-1 text-sm text-slate-400">
                支持单文件直传，最大 2GB，拖拽到此处或点击选择
              </p>
            </div>
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="prefix" className="text-sm font-medium text-slate-300">
            目录前缀（可选）
          </label>
          <input
            id="prefix"
            value={prefix}
            onChange={(event) => setPrefix(event.target.value)}
            placeholder="如：team-uploads/2025/"
            className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-base text-slate-100 shadow-inner shadow-slate-950/60 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "uploading" || !file}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/40 transition hover:from-sky-300 hover:via-blue-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "uploading" ? "上传中..." : "开始上传"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-2xl border border-slate-700/70 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500/70 hover:text-white"
          >
            重置
          </button>
        </div>
      </form>

      {message && (
        <div
          className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ring-1 ring-inset ${
            status === "success"
              ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30"
              : status === "error"
                ? "bg-rose-500/10 text-rose-200 ring-rose-500/30"
                : "bg-sky-500/10 text-sky-200 ring-sky-500/30"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-8">
        <R2ObjectList refreshToken={refreshToken} />
      </div>
    </div>
  );
}
