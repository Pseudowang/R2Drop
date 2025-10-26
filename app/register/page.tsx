"use client";

// 声明这是一个客户端组件，因为我们需要使用 useState 和处理表单事件
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfettiBurst from "../components/ConfettiBurst";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // 用于显示成功或错误消息
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!showConfetti) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowConfetti(false);
      router.push("/login");
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [router, showConfetti]);

  // 表单提交处理函数
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止表单默认提交
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("注册成功！正在跳转到登录页面...");
        setShowConfetti(true);
      } else {
        // 显示来自 API 的错误消息
        setMessage(data.message || "注册失败，请重试。");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("注册请求失败:", error);
      setMessage("发生网络错误，请稍后重试。");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-6 py-16 text-slate-100">
      <ConfettiBurst active={showConfetti} />

      <div className="absolute inset-0 -z-10">
        <div className="absolute left-10 top-0 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute right-0 bottom-8 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.25),_transparent_60%)]" />
      </div>

      <div className="w-full max-w-5xl grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="order-last space-y-6 lg:order-first">
          <p className="inline-flex items-center rounded-full bg-cyan-500/15 px-4 py-1 text-sm font-medium text-cyan-200 ring-1 ring-cyan-400/40">
            准备好启程
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
            注册，即刻拥有加密文件协作与自动同步能力
          </h1>
          <p className="text-lg text-slate-300/90">
            统一安全策略、端到端日志与集中权限控制，让团队协同更专注。三步注册，立刻解锁智能空间。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "多因子保护", desc: "支持 OTP + 硬件密钥" },
              { title: "粒度权限", desc: "快速分配读写策略" },
              { title: "事件追踪", desc: "每次操作全量记录" },
              { title: "边缘加速", desc: "跨区域毫秒级响应" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-inner shadow-slate-950/60"
              >
                <h3 className="text-lg font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="relative">
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/50 via-blue-500/40 to-indigo-500/40 opacity-80 blur" />
          <div className="relative rounded-3xl bg-slate-950/75 p-10 shadow-[0_20px_70px_-30px_rgba(6,182,212,0.7)] ring-1 ring-slate-700/50 backdrop-blur">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-50">
              创建新账户
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              输入常用邮箱与强密码。注册后即可立刻使用登录入口。
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-200"
                >
                  电子邮箱
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-base text-slate-50 shadow-inner shadow-slate-950/60 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/60"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label
                    htmlFor="password"
                    className="font-medium text-slate-200"
                  >
                    密码
                  </label>
                  <span className="text-xs text-slate-500">至少 6 位字符</span>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-base text-slate-50 shadow-inner shadow-slate-950/60 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/60"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 transition hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{isLoading ? "注册中..." : "注册"}</span>
              </button>
            </form>

            {message && (
              <p
                className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ring-1 ring-inset ${
                  message.includes("成功")
                    ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30"
                    : "bg-rose-500/10 text-rose-200 ring-rose-500/30"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-slate-400">
              已经有账户了？{" "}
              <Link
                href="/login"
                className="font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                点此登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
