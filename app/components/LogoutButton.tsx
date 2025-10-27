"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(targetNode)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    startTransition(() => {
      void signOut({ callbackUrl: "/login" });
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className="relative inline-flex h-9 items-center justify-end">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/60 text-slate-200 transition hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/60"
      >
        <span className="sr-only">打开用户菜单</span>
        <svg
          className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 8.5L10 13.5L15 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isMenuOpen ? (
        <div className="absolute right-0 top-10 z-20 w-40 origin-top-right rounded-xl border border-slate-700/60 bg-slate-950/90 p-1 shadow-xl shadow-slate-950/40 ring-1 ring-black/40 backdrop-blur">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800/70 disabled:cursor-not-allowed disabled:text-slate-500"
          >
            <span>{isPending ? "登出中..." : "退出登录"}</span>
            <svg
              className="h-3 w-3 text-slate-400"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7.5 5.5L12.5 10L7.5 14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
