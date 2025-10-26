// 登录页面也是客户端组件
"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react"; // 导入 next-auth 的 signIn 函数
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfettiBurst from "../components/ConfettiBurst";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!showConfetti) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowConfetti(false);
      router.push("/dashboard");
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [router, showConfetti]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 调用 next-auth 的 signIn 函数
      // 我们使用 'credentials' 作为 provider (在 ...nextauth/route.ts 中定义的)
      const result = await signIn("credentials", {
        // **关键**: redirect: false 告诉 next-auth 不要自动跳转
        // 这样我们就可以手动处理登录成功或失败的逻辑
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.ok) {
        // 登录成功！
        // 手动跳转到仪表盘或受保护的页面
        setShowConfetti(true);
      } else {
        // 登录失败
        setError("登录失败：无效的电子邮箱或密码。");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      setError("发生网络错误，请稍后重试。");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-6 py-16 text-slate-100">
      <ConfettiBurst active={showConfetti} duration={1200} />

      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute right-1/5 bottom-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.25),_transparent_55%)]" />
      </div>

      <div className="w-full max-w-5xl grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-200 ring-1 ring-inset ring-blue-500/40">
            欢迎回来
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
            登录以继续管理您的安全文件空间
          </h1>
          <p className="text-lg text-slate-300/90">
            统一控制台带来了实时同步、快速检索与多因素保护。继续访问您的仪表盘，查看最新上传和团队活动。
          </p>
          <ul className="flex flex-wrap gap-3 text-sm text-slate-400">
            <li className="flex items-center gap-2 rounded-full bg-slate-900/40 px-4 py-2 ring-1 ring-slate-700/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              在线状态同步
            </li>
            <li className="flex items-center gap-2 rounded-full bg-slate-900/40 px-4 py-2 ring-1 ring-slate-700/60">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              零信任会话
            </li>
            <li className="flex items-center gap-2 rounded-full bg-slate-900/40 px-4 py-2 ring-1 ring-slate-700/60">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              AES-256 加密
            </li>
          </ul>
        </section>

        <div className="relative">
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-500/60 via-sky-500/40 to-cyan-400/40 opacity-80 blur" />
          <div className="relative rounded-3xl bg-slate-950/75 p-10 shadow-[0_20px_70px_-30px_rgba(15,118,255,0.7)] ring-1 ring-slate-700/50 backdrop-blur">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-50">登录账户</h2>
            <p className="mt-2 text-sm text-slate-400">
              输入凭据以访问仪表盘。忘记密码请联系管理员。
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  电子邮箱
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-base text-slate-50 shadow-inner shadow-slate-950/60 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="password" className="font-medium text-slate-200">
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
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-base text-slate-50 shadow-inner shadow-slate-950/60 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-blue-900/40 transition hover:from-indigo-500 hover:via-sky-500 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{isLoading ? "登录中..." : "登录"}</span>
              </button>
            </form>

            {error && (
              <p className="mt-5 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 ring-1 ring-inset ring-rose-500/30">
                {error}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-slate-400">
              还没有账户？{" "}
              <Link
                href="/register"
                className="font-medium text-sky-300 transition hover:text-sky-200"
              >
                点此注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
