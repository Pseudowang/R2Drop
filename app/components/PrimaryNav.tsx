import Link from "next/link";

export type NavKey = "dashboard" | "upload" | "files";

interface PrimaryNavProps {
  active: NavKey;
  className?: string;
}

const baseClasses =
  "rounded-full border border-slate-700/60 bg-slate-900/40 px-4 py-2 transition hover:border-slate-500/70 hover:text-white";

const activeClasses =
  "group inline-flex items-center gap-2 rounded-full border border-sky-400/60 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-500/20 px-4 py-2 text-sky-100 transition hover:border-sky-300 hover:from-sky-500/30 hover:to-blue-500/30";

const navItems: Array<{ key: NavKey; href: string; label: string }> = [
  { key: "dashboard", href: "/dashboard", label: "仪表盘" },
  { key: "upload", href: "/upload", label: "文件上传" },
  { key: "files", href: "/files", label: "文件总览" },
];

export default function PrimaryNav({ active, className }: PrimaryNavProps) {
  return (
    <nav className={`flex items-center gap-3 text-sm font-semibold text-slate-200 ${className ?? ""}`}>
      {navItems.map((item) => {
        const isActive = item.key === active;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={isActive ? activeClasses : baseClasses}
          >
            <span>{item.label}</span>
            {isActive ? (
              <span className="h-1 w-1 rounded-full bg-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
