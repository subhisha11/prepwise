"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, ChevronDown, Clock3, Code2, Lightbulb, Play, RotateCcw, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Badge, Button } from "@/components/ui";

type Question = {
  id:string; slug:string; title:string; difficulty:string; topic:string; description:string;
  examples:{input:string;output:string}[]; constraints:string[]; starter_code:string; test_case_count:number;
};
type Result = { status:string; passed:number; total:number; runtime_ms:number; feedback:string };

export default function CodingPage(){
  const questions=useQuery<Question[]>({queryKey:["questions"],queryFn:()=>api("/coding/questions")});
  const [selected,setSelected]=useState<Question|null>(null);
  const [code,setCode]=useState("");
  const [result,setResult]=useState<Result|null>(null);
  useEffect(()=>{if(questions.data?.length&&!selected){setSelected(questions.data[0]);setCode(questions.data[0].starter_code)}},[questions.data,selected]);
  const submission=useMutation({
    mutationFn:()=>api<Result>("/coding/submit",{method:"POST",body:JSON.stringify({question_id:selected?.id,code,language:"python"})}),
    onSuccess:setResult,
  });
  if(!selected)return <div className="card h-96 animate-pulse"/>;
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="display text-3xl font-bold">Coding arena</h2><p className="mt-2 text-[#6e7872]">Practice deliberately. Learn the pattern, not just the answer.</p></div><div className="flex items-center gap-3 rounded-xl border border-[#dfe4dc] bg-white px-4 py-2.5 text-sm"><span className="text-[#7b857f]">Problem</span><select className="bg-transparent font-semibold outline-none" value={selected.id} onChange={e=>{const q=questions.data?.find(x=>x.id===e.target.value);if(q){setSelected(q);setCode(q.starter_code);setResult(null)}}}>{questions.data?.map(q=><option value={q.id} key={q.id}>{q.title}</option>)}</select><ChevronDown size={15}/></div></div>
      <div className="grid min-h-[680px] overflow-hidden rounded-[24px] border border-[#dce2da] bg-white shadow-sm lg:grid-cols-[.83fr_1.17fr]">
        <section className="scrollbar overflow-y-auto border-b border-[#e2e6df] p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2"><Badge tone={selected.difficulty==="Easy"?"green":"orange"}>{selected.difficulty}</Badge><Badge tone="gray">{selected.topic}</Badge></div>
          <h3 className="display mt-4 text-3xl font-bold">{selected.title}</h3>
          <p className="mt-5 leading-7 text-[#56615b]">{selected.description}</p>
          <div className="mt-7"><h4 className="text-sm font-bold uppercase tracking-[.12em] text-[#7f8983]">Example</h4>{selected.examples.map(ex=><div className="mt-3 rounded-2xl bg-[#f5f7f3] p-4 font-mono text-sm" key={ex.input}><p><span className="text-[#7b857f]">Input:</span> {ex.input}</p><p className="mt-2"><span className="text-[#7b857f]">Output:</span> {ex.output}</p></div>)}</div>
          <div className="mt-7"><h4 className="text-sm font-bold uppercase tracking-[.12em] text-[#7f8983]">Constraints</h4><ul className="mt-3 space-y-2">{selected.constraints.map(item=><li className="font-mono text-sm text-[#56615b]" key={item}>• {item}</li>)}</ul></div>
          <button className="mt-8 flex items-center gap-2 rounded-xl bg-[#fff7ea] px-4 py-3 text-sm font-semibold text-[#9b581f]"><Lightbulb size={17}/> Give me a guided hint</button>
        </section>
        <section className="flex min-w-0 flex-col bg-[#17211d] text-white">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3"><div className="flex items-center gap-3"><Code2 size={17} className="text-[#dff28c]"/><span className="text-sm font-semibold">solution.py</span><Badge className="bg-white/8 text-white/60">Python 3</Badge></div><button onClick={()=>{setCode(selected.starter_code);setResult(null)}} className="text-white/45 hover:text-white"><RotateCcw size={16}/></button></div>
          <div className="relative flex-1">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-12 border-r border-white/5 bg-black/10 pt-5 text-right font-mono text-sm leading-7 text-white/20">{Array.from({length:Math.max(18,code.split("\n").length)},(_,i)=><div className="pr-3" key={i}>{i+1}</div>)}</div>
            <textarea spellCheck={false} value={code} onChange={e=>setCode(e.target.value)} className="scrollbar h-full min-h-[440px] w-full resize-none bg-transparent py-5 pl-16 pr-5 font-mono text-sm leading-7 text-[#d8e3dc] outline-none" />
          </div>
          {result&&<div className={`mx-4 mb-4 rounded-2xl border p-4 ${result.status==="Accepted"?"border-[#5ba27f]/40 bg-[#244f3d]":"border-[#c56a5b]/40 bg-[#4a2926]"}`}><div className="flex items-center justify-between"><p className="flex items-center gap-2 font-bold">{result.status==="Accepted"?<CheckCircle2 size={19} className="text-[#dff28c]"/>:<XCircle size={19} className="text-[#f29a8e]"/>}{result.status}</p><span className="flex items-center gap-1 text-xs text-white/50"><Clock3 size={13}/>{result.runtime_ms} ms</span></div><p className="mt-2 text-sm text-white/65">{result.passed}/{result.total} test cases passed · {result.feedback}</p></div>}
          {submission.error&&<p className="mx-4 mb-3 text-sm text-[#f29a8e]">{submission.error.message}</p>}
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4"><span className="text-xs text-white/35">{selected.test_case_count} hidden tests</span><div className="flex gap-2"><Button variant="secondary" className="border-white/15 bg-white/5 text-white hover:border-white/30"><Play size={15}/> Run</Button><Button loading={submission.isPending} onClick={()=>submission.mutate()} className="bg-[#dff28c] text-[#183d2e] hover:bg-[#d5e97d]">Submit solution</Button></div></div>
        </section>
      </div>
    </div>
  );
}

