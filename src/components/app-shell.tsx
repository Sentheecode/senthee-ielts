"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  CheckSquare,
  Headphones,
  Home,
  NotebookTabs,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { href: "/", label: "首页", icon: Home },
  { href: "/practice", label: "练习", icon: CheckSquare },
  { href: "/vocabulary", label: "词库", icon: NotebookTabs },
  { href: "/coach", label: "Agent", icon: Bot },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="主导航">
        <Link href="/" className="brand" aria-label="Senthee IELTS 首页">
          7
        </Link>
        <nav className="sidebar-nav">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            <Home aria-hidden="true" /> 首页
          </Link>
          <Link href="/practice" className={`nav-link ${pathname === "/practice" ? "active" : ""}`}>
            <Headphones aria-hidden="true" /> 练习
          </Link>
          <Link href="/vocabulary" className={`nav-link ${pathname === "/vocabulary" ? "active" : ""}`}>
            <BookOpen aria-hidden="true" /> 词库
          </Link>
          <Link href="/coach" className={`nav-link ${pathname === "/coach" ? "active" : ""}`}>
            <Bot aria-hidden="true" /> Agent
          </Link>
          <span className="nav-link muted-link">
            <BarChart3 aria-hidden="true" /> 模考
          </span>
          <span className="nav-link muted-link">
            <Settings aria-hidden="true" /> 设置
          </span>
        </nav>
        <div className="profile-mini">
          <span>S</span>
          <div>
            <strong>Senthee</strong>
            <small>目标 7 分</small>
          </div>
        </div>
      </aside>
      <div className="page-frame">{children}</div>
      <nav className="bottom-nav" aria-label="移动端主导航">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
