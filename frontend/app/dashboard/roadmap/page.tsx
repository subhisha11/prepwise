"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookOpenCheck, CalendarDays, Check, Clock3, Flag, RotateCw } from "lucide-react";
import { api } from "@/lib/api";
import { Badge, Button, Field } from "@/components/ui";

type Week = { week: number; phase: string; focus: string; hours: number; tasks: string[]; completed: boolean };
type Roadmap = { target_role: string; timeline_weeks: number; daily_hours: number; progress: number; plan: Week[] };

export default function RoadmapPage() {
  const [configure, setConfigure] = useState(false);
  const query = useQuery<Roadmap>({ queryKey:["roadmap"], queryFn:()=>api("/roadmaps/latest"), retry:false });
  const mutation = useMutation({
    mutationFn:(payload:object)=>api<Roadmap>("/roadmaps",{method:"POST",body:JSON.stringify(payload)}),
    onSuccess:data=>{ query.refetch(); setConfigure(false); },
  });
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault(); const form=new FormData(event.currentTarget); mutation.mutate({target_role:form.get("target_role"),timeline_weeks:Number(form.get("timeline_weeks")),daily_hours:Number(form.get("daily_hours"))});}
  const roadmap=query.data;
  if (query.isLoading) return <div className="card h-96 animate-pulse" />;
  if (!roadmap || configure) return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-7 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e4f2ea] text-[#1c5c43]"><BookOpenCheck /></span><h2 className="display mt-5 text-3xl font-bold">{roadmap ? "Rebuild your roadmap" : "Let’s map the path to your offer."}</h2><p className="mt-2 text-[#6f7973]">Tell us the destination and the time you can genuinely commit.</p></div>
      <form onSubmit={submit} className="card space-y-5 p-7">
        <div><label className="mb-2 block text-sm font-semibold">Target role</label><Field name="target_role" defaultValue={roadmap?.target_role || "Backend Engineer"} required /></div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold">Placement timeline</label><select name="timeline_weeks" defaultValue={roadmap?.timeline_weeks || 12} className="w-full rounded-xl border border-[#dfe4dc] bg-white px-4 py-3 outline-none"><option value="8">8 weeks</option><option value="12">12 weeks</option><option value="16">16 weeks</option><option value="24">24 weeks</option></select></div><div><label className="mb-2 block text-sm font-semibold">Focused hours per day</label><select name="daily_hours" defaultValue={roadmap?.daily_hours || 2.5} className="w-full rounded-xl border border-[#dfe4dc] bg-white px-4 py-3 outline-none"><option value="1">1 hour</option><option value="2">2 hours</option><option value="2.5">2.5 hours</option><option value="4">4 hours</option></select></div></div>
        {mutation.error && <p className="rounded-xl bg-[#fde8e5] p-3 text-sm text-[#a84236]">{mutation.error.message}</p>}
        <div className="flex gap-3"><Button loading={mutation.isPending} className="flex-1">Generate adaptive roadmap</Button>{roadmap&&<Button type="button" variant="secondary" onClick={()=>setConfigure(false)}>Cancel</Button>}</div>
      </form>
    </div>
  );
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Badge>{roadmap.target_role}</Badge><h2 className="display mt-3 text-3xl font-bold">Your {roadmap.timeline_weeks}-week placement plan.</h2><p className="mt-2 text-[#6e7872]">{roadmap.daily_hours} focused hours a day · built around your current gaps</p></div><Button variant="secondary" onClick={()=>setConfigure(true)}><RotateCw size={15}/> Rebuild plan</Button></div>
      <div className="card mb-6 p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold">Overall progress</p><p className="display mt-1 text-3xl font-bold">{roadmap.progress}%</p></div><div className="flex gap-6 text-sm text-[#69736d]"><span className="flex items-center gap-2"><CalendarDays size={17}/> Week 5 of {roadmap.timeline_weeks}</span><span className="flex items-center gap-2"><Clock3 size={17}/> {roadmap.daily_hours * 6} hrs/week</span></div></div><div className="mt-5 h-2.5 rounded-full bg-[#e9ede7]"><div className="h-full rounded-full bg-[#2c7658]" style={{width:`${roadmap.progress}%`}} /></div></div>
      <div className="relative space-y-4 before:absolute before:bottom-6 before:left-[25px] before:top-6 before:w-px before:bg-[#d8dfd7]">
        {roadmap.plan.map(week=><div key={week.week} className={`card relative ml-14 p-6 ${week.week===5?"border-[#1c5c43] shadow-[0_8px_35px_rgba(28,92,67,.09)]":""}`}><span className={`absolute -left-[52px] top-6 z-10 grid h-10 w-10 place-items-center rounded-full border-4 border-[#f5f6f0] text-sm font-bold ${week.completed?"bg-[#1c5c43] text-white":week.week===5?"bg-[#dff28c] text-[#183d2e]":"bg-white text-[#849088]"}`}>{week.completed?<Check size={16}/>:week.week}</span><div className="flex flex-wrap justify-between gap-3"><div><div className="flex items-center gap-2"><Badge tone={week.week===5?"green":"gray"}>{week.phase}</Badge>{week.week===5&&<Badge tone="orange">Current week</Badge>}</div><h3 className="display mt-3 text-2xl font-bold">{week.focus}</h3></div><span className="flex items-center gap-1 text-sm text-[#7b857f]"><Clock3 size={15}/>{week.hours} hours</span></div><div className="mt-5 grid gap-2 md:grid-cols-3">{week.tasks.map(task=><div key={task} className="flex gap-2 rounded-xl bg-[#f7f8f4] p-3 text-sm leading-5 text-[#606b65]"><span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-[#bdc7bd]" />{task}</div>)}</div></div>)}
        <div className="relative ml-14 flex items-center gap-3 rounded-2xl border border-dashed border-[#ccd5cc] p-5 text-[#65706a]"><span className="absolute -left-[48px] grid h-8 w-8 place-items-center rounded-full bg-[#f2a65a] text-white"><Flag size={14}/></span><strong>Placement-ready checkpoint</strong><span className="text-sm">Final mock loop, resume tailoring, and application sprint.</span></div>
      </div>
    </div>
  );
}

