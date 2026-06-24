"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Clock3, Mic, Send, Sparkles, Square, UserRound } from "lucide-react";
import { api, getToken, wsUrl } from "@/lib/api";
import { Badge, Button } from "@/components/ui";

type Message={role:"interviewer"|"candidate";content:string};
type Complete={score:number;feedback:string[]};

export default function InterviewPage(){
  const [mode,setMode]=useState("technical");
  const [session,setSession]=useState<string|null>(null);
  const [messages,setMessages]=useState<Message[]>([]);
  const [socket,setSocket]=useState<WebSocket|null>(null);
  const [typing,setTyping]=useState(false);
  const [complete,setComplete]=useState<Complete|null>(null);
  const bottom=useRef<HTMLDivElement>(null);
  useEffect(()=>bottom.current?.scrollIntoView({behavior:"smooth"}),[messages,typing]);
  useEffect(()=>()=>socket?.close(),[socket]);
  async function start(){
    const data=await api<{id:string;first_question:string}>(`/interviews?mode=${mode}`,{method:"POST"});
    const ws=new WebSocket(`${wsUrl}/api/v1/interviews/ws/${data.id}?token=${getToken()}`);
    ws.onmessage=event=>{const payload=JSON.parse(event.data);setTyping(false);if(payload.type==="message")setMessages(old=>[...old,{role:"interviewer",content:payload.message}]);if(payload.type==="complete")setComplete({score:payload.score,feedback:payload.feedback})};
    setSocket(ws);setSession(data.id);setMessages([{role:"interviewer",content:data.first_question}]);
  }
  function send(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=new FormData(event.currentTarget);const text=String(form.get("message")||"").trim();if(!text||!socket)return;
    setMessages(old=>[...old,{role:"candidate",content:text}]);socket.send(JSON.stringify({type:"message",message:text}));setTyping(true);event.currentTarget.reset();
  }
  function end(){socket?.send(JSON.stringify({type:"end"}));}
  if(!session)return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e4f2ea] text-[#1c5c43]"><Mic size={27}/></span><h2 className="display mt-6 text-4xl font-bold">Practice the room before it matters.</h2><p className="mx-auto mt-3 max-w-xl text-[#6e7872]">Your AI interviewer follows up in real time, then shows exactly where your answers lose strength.</p></div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">{[
        ["technical","Technical","Projects, CS fundamentals, and system design"],
        ["behavioral","Behavioral","Ownership, conflict, failure, and teamwork"],
        ["hr","HR conversation","Motivation, strengths, culture, and career goals"],
      ].map(([value,title,text])=><button onClick={()=>setMode(value)} key={value} className={`card p-6 text-left transition ${mode===value?"border-[#1c5c43] ring-4 ring-[#1c5c43]/6":"hover:border-[#aab8ac]"}`}><span className={`grid h-10 w-10 place-items-center rounded-xl ${mode===value?"bg-[#1c5c43] text-white":"bg-[#eef1eb] text-[#65706a]"}`}><Bot size={19}/></span><h3 className="display mt-5 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#727c76]">{text}</p>{mode===value&&<Badge className="mt-5">Selected</Badge>}</button>)}</div>
      <div className="card mx-auto mt-6 max-w-2xl p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-bold">15–20 minute adaptive interview</p><p className="mt-1 text-sm text-[#737d77]">Text now · voice-ready architecture</p></div><div className="flex gap-4 text-xs text-[#68736d]"><span className="flex items-center gap-1"><Clock3 size={14}/> 4–6 questions</span><span className="flex items-center gap-1"><Sparkles size={14}/> Instant score</span></div></div><Button onClick={start} className="mt-5 w-full"><Mic size={16}/> Enter interview room</Button></div>
    </div>
  );
  if(complete)return <div className="mx-auto max-w-3xl"><div className="card p-8 text-center"><Badge>Interview complete</Badge><p className="display mt-6 text-7xl font-bold text-[#1c5c43]">{complete.score}</p><p className="mt-1 text-sm text-[#7b857f]">overall interview score</p><h2 className="display mt-8 text-3xl font-bold">A solid base. Now sharpen the evidence.</h2><div className="mt-7 space-y-3 text-left">{complete.feedback.map((item,i)=><div className="flex gap-4 rounded-2xl bg-[#f6f8f3] p-4" key={item}><span className="display text-2xl text-[#a6b1a7]">0{i+1}</span><p className="text-sm leading-6">{item}</p></div>)}</div><Button className="mt-7" onClick={()=>{setSession(null);setComplete(null);setMessages([])}}>Practice another interview</Button></div></div>;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#183d2e] px-5 py-4 text-white"><div className="flex items-center gap-3"><span className="relative grid h-10 w-10 place-items-center rounded-full bg-[#dff28c] text-[#183d2e]"><Bot size={20}/><i className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#183d2e] bg-[#63c48f]"/></span><div><p className="font-bold capitalize">{mode} interview</p><p className="text-xs text-white/50">AI interviewer · session in progress</p></div></div><Button onClick={end} className="bg-white/10 text-white shadow-none hover:bg-white/15"><Square size={13} fill="currentColor"/> End session</Button></div>
      <div className="card flex h-[650px] flex-col overflow-hidden">
        <div className="scrollbar flex-1 overflow-y-auto p-5 sm:p-8"><div className="mx-auto max-w-3xl space-y-6">{messages.map((message,i)=><div key={i} className={`flex gap-3 ${message.role==="candidate"?"justify-end":""}`}>{message.role==="interviewer"&&<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e4f2ea] text-[#1c5c43]"><Bot size={17}/></span>}<div className={`max-w-[78%] rounded-2xl px-5 py-4 text-sm leading-7 ${message.role==="candidate"?"rounded-tr-sm bg-[#1c5c43] text-white":"rounded-tl-sm bg-[#f2f4ef] text-[#4f5b55]"}`}>{message.content}</div>{message.role==="candidate"&&<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff0df] text-[#b76a29]"><UserRound size={17}/></span>}</div>)}{typing&&<div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#e4f2ea] text-[#1c5c43]"><Bot size={17}/></span><div className="flex items-center gap-1 rounded-2xl bg-[#f2f4ef] px-5"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a948e]"/><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a948e] [animation-delay:.15s]"/><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a948e] [animation-delay:.3s]"/></div></div>}<div ref={bottom}/></div></div>
        <form onSubmit={send} className="border-t border-[#e4e8e1] bg-[#fafbf8] p-4"><div className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-[#dce2da] bg-white p-2 pl-4 focus-within:border-[#1c5c43]"><textarea name="message" rows={2} placeholder="Type your answer naturally…" className="flex-1 resize-none py-2 text-sm outline-none"/><button disabled={typing} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1c5c43] text-white disabled:opacity-50"><Send size={17}/></button></div><p className="mt-2 text-center text-[11px] text-[#909893]">Aim for a clear 60–90 second answer. Specific examples beat perfect wording.</p></form>
      </div>
    </div>
  );
}

