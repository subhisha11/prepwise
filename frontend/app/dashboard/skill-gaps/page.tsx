"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock3, Compass, Target, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { Badge, Button } from "@/components/ui";

type Data={target_role:string;gaps:{skill:string;priority:string;estimated_weeks:number;recommendation:string}[]};
const fallback:Data={target_role:"Backend Engineer",gaps:[
  {skill:"Docker",priority:"High",estimated_weeks:2,recommendation:"Build a guided mini-project"},
  {skill:"System Design",priority:"High",estimated_weeks:4,recommendation:"Complete focused concept notes"},
  {skill:"Redis",priority:"Medium",estimated_weeks:2,recommendation:"Build a guided mini-project"},
  {skill:"AWS",priority:"Medium",estimated_weeks:3,recommendation:"Practice 10 interview questions"},
]};
export default function SkillGapsPage(){
  const {data=fallback}=useQuery({queryKey:["gaps"],queryFn:()=>api<Data>("/skill-gaps"),placeholderData:fallback});
  return <div className="mx-auto max-w-6xl">
    <div className="mb-7"><Badge>{data.target_role}</Badge><h2 className="display mt-3 text-3xl font-bold">The shortest path between you and the role.</h2><p className="mt-2 max-w-2xl text-[#6e7872]">Ranked from all available signals: resume evidence, coding patterns, and interview performance.</p></div>
    <div className="grid gap-5 lg:grid-cols-[1fr_.36fr]">
      <div className="space-y-4">{data.gaps.map((gap,index)=><div className="card p-6" key={gap.skill}><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className={`display grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl ${index<2?"bg-[#fff0df] text-[#a65d24]":"bg-[#eef1eb] text-[#6f7973]"}`}>0{index+1}</span><div><div className="flex items-center gap-2"><h3 className="display text-2xl font-bold">{gap.skill}</h3><Badge tone={gap.priority==="High"?"orange":"gray"}>{gap.priority} priority</Badge></div><p className="mt-1 flex items-center gap-1 text-sm text-[#7a847e]"><Clock3 size={14}/> About {gap.estimated_weeks} weeks to working confidence</p></div></div><Button variant="secondary">Start learning <ArrowRight size={15}/></Button></div><div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f7f8f4] p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#1c5c43]"><BookOpen size={17}/></span><div><p className="text-xs font-bold uppercase tracking-[.1em] text-[#8a938e]">Recommended next step</p><p className="mt-1 text-sm font-semibold">{gap.recommendation}</p></div></div></div>)}</div>
      <aside className="space-y-4"><div className="rounded-[24px] bg-[#1c5c43] p-6 text-white"><Target className="text-[#dff28c]"/><p className="mt-5 text-xs font-bold uppercase tracking-[.15em] text-white/45">Profile match</p><p className="display mt-2 text-5xl font-bold">68%</p><div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-[#dff28c]"/></div><p className="mt-4 text-sm leading-6 text-white/60">Closing your top two gaps could move you to an estimated 81% role match.</p></div><div className="card p-6"><Compass className="text-[#1c5c43]"/><h3 className="display mt-4 text-xl font-bold">A useful rule</h3><p className="mt-2 text-sm leading-6 text-[#6f7973]">Don’t “learn” a skill invisibly. Close each gap with a project, a solved problem set, or an answer you can defend.</p></div><div className="card p-6"><TrendingUp className="text-[#b76a29]"/><h3 className="display mt-4 text-xl font-bold">Estimated impact</h3><p className="mt-2 text-sm text-[#6f7973]">+13 readiness points in 4 focused weeks</p></div></aside>
    </div>
  </div>;
}

