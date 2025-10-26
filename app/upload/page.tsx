import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import UploadPanel from "./UploadPanel";
import PageHeader from "../components/PageHeader";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "文件上传 | My File App",
  description: "将文件安全上传至 Cloudflare R2",
};

export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/6 top-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-[140px]" />
        <div className="absolute right-0 bottom-10 h-[26rem] w-[26rem] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_60%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:px-10">
        <PageHeader
          badge="Cloudflare R2 上传面板"
          title="轻松上传并托管您的机密文件"
          description="支持目录前缀、元数据追踪与高可用加密存储。上传完成后即可在 R2 控制台中查看对象，后续将增加预签名下载和版本管理功能。"
          active="upload"
          email={session.user?.email ?? null}
        />

        <main className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <UploadPanel email={session.user?.email} />

          <aside className="space-y-5 rounded-3xl border border-slate-800/70 bg-slate-950/75 p-8 text-slate-200 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">使用指引</h2>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" />
                目录前缀会作为对象 Key 的前部分，可用来按团队或日期分类。例如 `team-alpha/2025/`。
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                文件大小建议控制在 2GB 内。大文件支持断点上传将在未来版本迭代。
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300" />
                上传成功后，将自动记录上传时间与操作者邮箱到对象元数据，便于审计。
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                若上传失败，请检查 R2 访问密钥是否配置正确，并确认当前网络允许访问 Cloudflare API。
              </li>
            </ul>
          </aside>
        </main>
      </div>
    </div>
  );
}
