"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, BookOpenCheck, Code2, FileSearch, LayoutDashboard,
  LogOut, Menu, MessageSquareText, Settings, Sparkles, Target, X,
} from "lucide-react";
import { useState } from "react";
import { clearToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume analyzer", icon: FileSearch },
  { href: "/dashboard/roadmap", label: "My roadmap", icon: BookOpenCheck },
  { href: "/dashboard/coding", label: "Coding arena", icon: Code2 },
  { href: "/dashboard/interview", label: "Mock interview", icon: MessageSquareText },
  { href: "/dashboard/skill-gaps", label: "Skill gaps", icon: Target },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const title = navigation.find(item => item.href === pathname)?.label || "Overview";
  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#183d2e] p-5 text-white transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between"><Logo light /><button className="lg:hidden" onClick={() => setOpen(false)}><X size={20} /></button></div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#f2a65a] text-sm font-bold">AS</span><div><p className="text-sm font-bold">Aarav Sharma</p><p className="text-xs text-white/50">Backend Engineer</p></div></div>
          <div className="mt-4 h-1.5 rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-[#dff28c]" /></div>
          <div className="mt-2 flex justify-between text-[11px] text-white/50"><span>Profile strength</span><span>72%</span></div>
        </div>
        <nav className="mt-7 flex-1 space-y-1">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/35">Workspace</p>
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition", active ? "bg-[#dff28c] text-[#183d2e]" : "text-white/65 hover:bg-white/7 hover:text-white")}><Icon size={18} />{label}{label === "Mock interview" && <span className="ml-auto rounded-full bg-[#f2a65a] px-2 py-0.5 text-[9px] font-bold text-white">LIVE</span>}</Link>;
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 pt-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/55 hover:bg-white/7"><Settings size={18} />Settings</button>
          <button onClick={() => { clearToken(); router.push("/login"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/55 hover:bg-white/7"><LogOut size={18} />Sign out</button>
        </div>
      </aside>
      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e1e5de] bg-[#f5f6f0]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3"><button className="grid h-10 w-10 place-items-center rounded-xl bg-white lg:hidden" onClick={() => setOpen(true)}><Menu size={20} /></button><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#8b948f]">PrepWise workspace</p><h1 className="display text-xl font-bold">{title}</h1></div></div>
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-full border border-[#dce1da] bg-white px-4 py-2 text-xs font-semibold text-[#1c5c43] sm:flex"><Sparkles size={14} /> Ask your mentor</button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1c5c43] text-xs font-bold text-white">AS</span>
          </div>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

