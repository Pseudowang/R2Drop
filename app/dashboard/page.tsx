// 这是一个简单受保护页面的占位符
// 我们登录后会跳转到这里

import { getServerSession } from "next-auth/next";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PageHeader from "../components/PageHeader";
import LogoutButton from "../components/LogoutButton";

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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute right-1/6 bottom-10 h-[28rem] w-[28rem] rounded-full bg-cyan-400/25 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:px-10">
        <PageHeader
          badge="安全文件控制中心"
          title="欢迎回来"
          description="掌握上传概况、空间使用率以及安全状态信息。"
          active="dashboard"
          email={session.user?.email ?? null}
          extra={<LogoutButton />}
        />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-400">文件概览</p>
                  <h2 className="mt-1 text-3xl font-semibold text-slate-50">即将上线</h2>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-4 py-1 text-sm font-semibold text-emerald-300">
                  稳定运行
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                仪表盘将为你提供上传追踪、空间使用率、团队协作状态以及敏感操作日志。敬请期待更多实用特性。
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "今日上传", value: "—" },
                  { label: "空间利用", value: "—" },
                  { label: "团队成员", value: "—" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "即将开放的文件上传",
                  desc: "支持大文件断点续传，上传全程加密。",
                  accent: "from-blue-500/40 to-sky-400/20",
                },
                {
                  title: "跨区域同步",
                  desc: "智能 CDN 让团队共享毫秒级延迟。",
                  accent: "from-indigo-500/30 to-purple-500/20",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`rounded-3xl border border-slate-800/80 bg-gradient-to-br ${card.accent} p-6 text-slate-200`}
                >
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{card.desc}</p>
                  <div className="mt-4 text-xs uppercase tracking-widest text-slate-400">
                    Feature Preview
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-8 backdrop-blur">
              <p className="text-sm font-semibold text-slate-400">安全状态</p>
              <div className="mt-5 flex flex-col gap-4">
                {[
                  {
                    label: "实时监测",
                    status: "已启用",
                    color: "bg-emerald-500/20 text-emerald-200",
                  },
                  {
                    label: "访问控制",
                    status: "零信任策略",
                    color: "bg-sky-500/20 text-sky-200",
                  },
                  {
                    label: "加密等级",
                    status: "AES-256",
                    color: "bg-indigo-500/20 text-indigo-200",
                  },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/40 px-4 py-3"
                  >
                    <span className="text-sm text-slate-300">{badge.label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                      {badge.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-transparent p-8 text-slate-200">
              <h3 className="text-2xl font-semibold text-white">下一步</h3>
              <p className="mt-3 text-sm text-slate-300">
                上传模块和共享链接即将开放。届时你可以：
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-300" />
                  上传大型文件并享受自动分片
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  为团队成员分配细粒度权限
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  跟踪审计日志，掌握每一次访问
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
