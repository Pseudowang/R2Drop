import type { ReactNode } from "react";
import PrimaryNav, { type NavKey } from "./PrimaryNav";

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  active: NavKey;
  email?: string | null;
  extra?: ReactNode;
}

export default function PageHeader({
  badge,
  title,
  description,
  active,
  email,
  extra,
}: PageHeaderProps) {
  return (
    <header className="rounded-3xl border border-white/5 bg-white/5 px-6 py-6 shadow-[0_15px_40px_-30px_rgba(59,130,246,0.8)] backdrop-blur">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
        <div className="max-w-2xl space-y-3">
          {badge ? (
            <span className="inline-flex w-max items-center rounded-full bg-sky-500/15 px-4 py-1 text-sm font-semibold text-sky-200 ring-1 ring-sky-500/30">
              {badge}
            </span>
          ) : null}
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
            {description ? (
              <p className="mt-3 text-sm text-slate-300">{description}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <PrimaryNav active={active} />
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 px-5 py-3 text-left text-sm text-slate-300">
          <span className="block text-xs uppercase tracking-widest text-slate-500">当前用户</span>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="text-base font-semibold text-sky-200">{email ?? "未登录"}</span>
            {extra ?? null}
          </div>
        </div>
      </div>
    </header>
  );
}
