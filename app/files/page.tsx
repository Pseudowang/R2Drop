import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import PageHeader from "../components/PageHeader";
import R2ObjectList from "../components/R2ObjectList";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "文件总览 | My File App",
  description: "查看、下载并删除已上传到 Cloudflare R2 的文件",
};

export default async function FilesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-24 h-[26rem] w-[26rem] rounded-full bg-indigo-500/20 blur-[130px]" />
        <div className="absolute right-1/5 bottom-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/25 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_60%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:px-10">
        <PageHeader
          badge="Cloudflare R2 文件中心"
          title="查看已上传的文件"
          description="在此浏览上传记录，快速执行下载或删除操作，管理团队的敏感文件。"
          active="files"
          email={session.user?.email ?? null}
        />

        <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <R2ObjectList heading="文件列表" subtitle="最近 50 个对象 · 支持下载 / 删除" />

          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-8 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">快速筛选</h2>
            <p className="mt-3 text-sm text-slate-300">
              文件列表暂时按上传时间倒序加载最近 50 条。可在上传模块中使用目录前缀实现更精细的分类。后续将开放条件过滤、批量操作以及版本管理功能。
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                点击下载将通过受保护的 API 获取临时流式内容。
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-rose-300" />
                删除操作不可恢复，请确认对象不再需要后再执行。
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                若列表为空，请刷新或检查 Cloudflare R2 凭据是否有效。
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
