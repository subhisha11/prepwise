"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, FileText, Lightbulb, ShieldCheck, UploadCloud, X, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { Badge, Button, ScoreRing } from "@/components/ui";

type Analysis = {
  filename: string; ats_score: number; skills_found: string[]; missing_skills: string[];
  strengths: string[]; weaknesses: string[]; suggestions: string[];
};

export default function ResumePage() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a PDF first");
      const form = new FormData(); form.append("file", file);
      return api<Analysis>("/resume/analyze", { method: "POST", body: form });
    },
    onSuccess: setResult,
  });
  function choose(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) { setFile(selected); setResult(null); }
  }
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7"><h2 className="display text-3xl font-bold">Make every line earn the interview.</h2><p className="mt-2 text-[#6e7872]">Upload a PDF and get role-aware ATS analysis, not generic formatting advice.</p></div>
      {!result ? (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="card p-7">
            <button onClick={() => input.current?.click()} className="flex min-h-[360px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ccd6cc] bg-[#fafbf7] p-8 transition hover:border-[#1c5c43] hover:bg-[#f4f8f2]">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e4f2ea] text-[#1c5c43]"><UploadCloud size={30} /></span>
              <h3 className="display mt-6 text-2xl font-bold">{file ? file.name : "Drop your resume here"}</h3>
              <p className="mt-2 text-sm text-[#7a847e]">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze` : "or click to browse · PDF up to 5 MB"}</p>
              <input ref={input} type="file" accept="application/pdf" className="hidden" onChange={choose} />
            </button>
            {mutation.error && <p className="mt-4 rounded-xl bg-[#fde8e5] p-3 text-sm text-[#a84236]">{mutation.error.message}</p>}
            <Button className="mt-5 w-full" loading={mutation.isPending} disabled={!file} onClick={() => mutation.mutate()}><Zap size={16} /> Analyze my resume</Button>
          </div>
          <div className="space-y-4">
            <div className="card p-6"><ShieldCheck className="text-[#1c5c43]" /><h3 className="display mt-4 text-xl font-bold">Private by design</h3><p className="mt-2 text-sm leading-6 text-[#717b75]">Your resume is parsed for analysis and is never used to train public models.</p></div>
            <div className="card p-6"><Lightbulb className="text-[#b76a29]" /><h3 className="display mt-4 text-xl font-bold">What you’ll learn</h3><ul className="mt-4 space-y-3 text-sm text-[#65706a]">{["ATS compatibility score","Skills recruiters will detect","Role-specific missing keywords","Concrete bullet improvements"].map(item=><li key={item} className="flex gap-2"><Check size={16} className="mt-0.5 text-[#2c7658]" />{item}</li>)}</ul></div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="card flex flex-col items-center justify-between gap-6 p-7 sm:flex-row">
            <div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e4f2ea] text-[#1c5c43]"><FileText /></span><div><Badge>Analysis complete</Badge><h3 className="display mt-2 text-2xl font-bold">{result.filename}</h3><p className="text-sm text-[#77817b]">Optimized for your target role</p></div></div>
            <div className="flex items-center gap-5"><ScoreRing value={result.ats_score} /><div><p className="font-bold">Strong foundation</p><p className="mt-1 max-w-52 text-sm text-[#737d77]">A few targeted changes can move this into the top tier.</p></div></div>
            <Button variant="secondary" onClick={() => { setFile(null); setResult(null); }}><X size={15}/> New resume</Button>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="card p-6"><h3 className="display text-xl font-bold">Skills recruiters will find</h3><div className="mt-5 flex flex-wrap gap-2">{result.skills_found.map(skill=><Badge key={skill}>{skill}</Badge>)}</div></div>
            <div className="card p-6"><h3 className="display text-xl font-bold">Missing for this role</h3><div className="mt-5 flex flex-wrap gap-2">{result.missing_skills.map(skill=><Badge key={skill} tone="orange">{skill}</Badge>)}</div></div>
            <Insight title="What’s working" items={result.strengths} good />
            <Insight title="What’s holding it back" items={result.weaknesses} />
          </div>
          <div className="card p-6"><h3 className="display text-xl font-bold">Your next three edits</h3><div className="mt-5 grid gap-3 md:grid-cols-3">{result.suggestions.map((item,i)=><div key={item} className="rounded-2xl bg-[#f7f8f4] p-5"><span className="display text-3xl text-[#bcc6bc]">0{i+1}</span><p className="mt-5 text-sm leading-6">{item}</p></div>)}</div></div>
        </div>
      )}
    </div>
  );
}

function Insight({ title, items, good = false }: { title: string; items: string[]; good?: boolean }) {
  return <div className="card p-6"><h3 className="display text-xl font-bold">{title}</h3><ul className="mt-5 space-y-3">{items.map(item=><li key={item} className="flex gap-3 text-sm leading-6 text-[#64706a]"><span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full ${good ? "bg-[#e4f2ea] text-[#1c5c43]" : "bg-[#fff0df] text-[#b76a29]"}`}>{good ? <Check size={12}/> : "!"}</span>{item}</li>)}</ul></div>;
}

