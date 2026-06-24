"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, Code2,
  FileSearch, MessageSquareText, Sparkles, Target, TrendingUp,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { api } from "@/lib/api";
import { Badge, Button, ScoreRing } from "@/components/ui";

type Dashboard = {
  user: { name: string; target_role: string };
  metrics: { ats_score: number; readiness_score: number; coding_accuracy: number; interview_score: number; roadmap_progress: number };
  skill_gaps: string[];
  recommendations: string[];
  weekly_goals: { label: string; progress: number; total: number }[];
  activity: { day: string; coding: number; learning: number }[];
};

const fallback: Dashboard = {
  user: { name: "Loading. . .", target_role: "Student" },
  metrics: { ats_score: 84, readiness_score: 72, coding_accuracy: 68, interview_score: 74, roadmap_progress: 36 },
  skill_gaps: ["Docker", "System Design", "Redis", "AWS"],
  recommendations: ["Solve two dynamic programming patterns this week.", "Build a Dockerized FastAPI service.", "Practice one system-design walkthrough."],
  weekly_goals: [
    { label: "Solve 8 DSA problems", progress: 5, total: 8 },
    { label: "Complete DBMS revision", progress: 3, total: 5 },
    { label: "Practice mock interview", progress: 1, total: 2 },
  ],
  activity: [
    { day: "Mon", coding: 42, learning: 30 }, { day: "Tue", coding: 55, learning: 48 },
    { day: "Wed", coding: 48, learning: 62 }, { day: "Thu", coding: 72, learning: 54 },
    { day: "Fri", coding: 64, learning: 76 }, { day: "Sat", coding: 82, learning: 68 },
    { day: "Sun", coding: 74, learning: 84 },
  ],
};

export default function DashboardPage() {
  const { data,isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: () => api<Dashboard>("/dashboard"), placeholderData: fallback });
  if (isLoading || !data) {
    return (
       <div className="p-6">Loading dashboard...</div>
    );
  }
  const firstName = data.user.name.split(" ")[0];
  return (
    <div className="mx-auto max-w-[1440px]">
      <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm text-[#78827c]">Wednesday, 24 June</p><h2 className="display mt-1 text-3xl font-bold sm:text-4xl">Good morning, {firstName}.</h2><p className="mt-2 text-[#6d7771]">You’re building momentum. Here’s the smartest next move.</p></div>
        <Link href="/dashboard/roadmap"><Button>Continue roadmap <ArrowRight size={16} /></Button></Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <div className="relative overflow-hidden rounded-[26px] bg-[#1c5c43] p-7 text-white sm:p-8">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#dff28c]/15" />
          <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-md"><Badge className="bg-white/10 text-[#dff28c]"><Sparkles size={12} className="mr-1" /> AI mentor insight</Badge><h3 className="display mt-5 text-3xl leading-tight">Focus on system design before adding another project.</h3><p className="mt-3 leading-7 text-white/60">Your coding fundamentals are improving faster than your architecture skills. One focused week will make your backend profile more balanced.</p><Link href="/dashboard/skill-gaps"><button className="mt-6 flex items-center gap-2 text-sm font-bold text-[#dff28c]">See the evidence <ArrowRight size={15} /></button></Link></div>
            <div className="shrink-0 rounded-full bg-white/7 p-3"><div className="[&_circle:last-of-type]:stroke-[#dff28c]"><ScoreRing value={data.metrics.readiness_score} size={132} /></div><p className="-mt-2 pb-2 text-center text-[10px] font-bold uppercase tracking-[.14em] text-white/45">Readiness</p></div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#849088]">Weekly momentum</p><h3 className="display mt-1 text-2xl font-bold">4 day streak</h3></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0df] text-[#bd6d29]"><TrendingUp size={21} /></span></div>
          <div className="mt-5 h-32">
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={data.activity}><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#2c7658" stopOpacity={.25}/><stop offset="95%" stopColor="#2c7658" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0eb" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11, fill:"#8a938e"}} /><Tooltip contentStyle={{borderRadius:12,border:"1px solid #e2e6df",fontSize:12}} /><Area type="monotone" dataKey="learning" stroke="#2c7658" strokeWidth={3} fill="url(#fill)" /></AreaChart></ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Resume ATS", value: data.metrics.ats_score, suffix: "/100", icon: FileSearch, color: "bg-[#e4f2ea] text-[#1c5c43]", href: "/dashboard/resume" },
          { label: "Coding accuracy", value: data.metrics.coding_accuracy, suffix: "%", icon: Code2, color: "bg-[#e8edfb] text-[#4660a9]", href: "/dashboard/coding" },
          { label: "Interview score", value: data.metrics.interview_score, suffix: "/100", icon: MessageSquareText, color: "bg-[#fff0df] text-[#b76a29]", href: "/dashboard/interview" },
          { label: "Roadmap done", value: data.metrics.roadmap_progress, suffix: "%", icon: BookOpenCheck, color: "bg-[#f0eafb] text-[#7352a1]", href: "/dashboard/roadmap" },
        ].map(({ label, value, suffix, icon: Icon, color, href }) => (
          <Link href={href} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg" key={label}>
            <div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={19} /></span><ArrowRight size={15} className="text-[#a8afaa] transition group-hover:translate-x-1 group-hover:text-[#1c5c43]" /></div><p className="mt-5 text-sm text-[#76807a]">{label}</p><p className="display mt-1 text-3xl font-bold">{value}<span className="ml-1 text-sm font-normal text-[#8e9691]">{suffix}</span></p>
          </Link>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[.95fr_1.05fr_.8fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#849088]">This week</p><h3 className="display mt-1 text-2xl font-bold">Your goals</h3></div><CheckCircle2 className="text-[#2c7658]" size={22} /></div>
          <div className="mt-6 space-y-5">
            {data.weekly_goals.map(goal => { const percent = Math.round(goal.progress / goal.total * 100); return <div key={goal.label}><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{goal.label}</span><span className="text-[#7c857f]">{goal.progress}/{goal.total}</span></div><div className="h-2 rounded-full bg-[#edf0eb]"><div className="h-full rounded-full bg-[#2c7658]" style={{width:`${percent}%`}} /></div></div>; })}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#849088]">Activity</p><h3 className="display mt-1 text-2xl font-bold">Practice balance</h3></div><BarChart3 size={22} className="text-[#65716b]" /></div>
          <div className="mt-6 h-44"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.activity}><CartesianGrid vertical={false} stroke="#edf0eb"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#8a938e"}}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #e2e6df",fontSize:12}}/><Area type="monotone" dataKey="coding" stroke="#1c5c43" fill="#1c5c43" fillOpacity={.08} strokeWidth={2}/><Area type="monotone" dataKey="learning" stroke="#f2a65a" fill="#f2a65a" fillOpacity={.07} strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
          <div className="mt-2 flex justify-center gap-5 text-xs text-[#76807a]"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#1c5c43]" /> Coding</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#f2a65a]" /> Learning</span></div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#849088]">Priority gaps</p><h3 className="display mt-1 text-2xl font-bold">Close these next</h3></div><Target size={22} className="text-[#b76a29]" /></div>
          <div className="mt-5 space-y-3">{data.skill_gaps.slice(0,4).map((skill,index)=><div key={skill} className="flex items-center justify-between rounded-xl bg-[#f7f8f4] px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-[#78817c]">{index+1}</span><span className="text-sm font-semibold">{skill}</span></div><Badge tone={index < 2 ? "orange" : "gray"}>{index < 2 ? "High" : "Med"}</Badge></div>)}</div>
          <Link href="/dashboard/skill-gaps"><Button variant="secondary" className="mt-5 w-full py-2.5">View full analysis</Button></Link>
        </div>
      </section>
    </div>
  );
}
