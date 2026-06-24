import Link from "next/link";
import {
  ArrowRight, BarChart3, Bot, BrainCircuit, Check, ChevronRight,
  Code2, FileSearch, MessageSquareText, Play, Sparkles, Target,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, ScoreRing } from "@/components/ui";

const features = [
  { icon: FileSearch, title: "Resume intelligence", text: "Get an ATS score, skill extraction, role-specific gaps, and changes that make every bullet earn its place." },
  { icon: BrainCircuit, title: "Adaptive roadmap", text: "A week-by-week plan that updates as your coding, interview, and learning performance changes." },
  { icon: Code2, title: "Coding assessment", text: "Practice curated problems, run code against tests, and track accuracy across high-impact topics." },
  { icon: MessageSquareText, title: "AI mock interviews", text: "Technical, HR, and behavioral interviews with real-time follow-ups, scores, and precise feedback." },
  { icon: Target, title: "Skill gap analysis", text: "See what separates your current profile from the target role, ordered by urgency and effort." },
  { icon: BarChart3, title: "One readiness score", text: "Resume, coding, aptitude, and interviews finally live in one honest view of placement readiness." },
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#f5f6f0]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Logo />
        <div className="hidden items-center gap-8 text-sm font-medium text-[#59635e] md:flex">
          <a href="#features" className="hover:text-[#1c5c43]">Features</a>
          <a href="#how" className="hover:text-[#1c5c43]">How it works</a>
          <a href="#stories" className="hover:text-[#1c5c43]">Student stories</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login"><Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button></Link>
          <Link href="/login"><Button>Start preparing <ArrowRight size={16} /></Button></Link>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.03fr_.97fr] lg:px-10 lg:pt-20">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6ddd4] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#1c5c43]">
            <Sparkles size={14} /> Your placement prep, finally personal
          </div>
          <h1 className="display text-[3.9rem] font-medium leading-[.96] text-[#19231f] sm:text-[5.3rem]">
            Prepare smarter.<br /><em className="font-normal text-[#1c5c43]">Get placed</em> sooner.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#64706a]">
            PrepWise studies your resume, coding, and interviews to build one adaptive plan—then coaches you through it, week by week.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/login"><Button className="px-7 py-3.5">Build my free roadmap <ArrowRight size={17} /></Button></Link>
            <a href="#how"><Button variant="secondary" className="px-7 py-3.5"><Play size={15} fill="currentColor" /> See how it works</Button></a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#6e7772]">
            {["No credit card", "Live demo mode", "Built for students"].map(item => (
              <span key={item} className="flex items-center gap-2"><Check size={15} className="text-[#2c7658]" />{item}</span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[540px]">
          <div className="absolute -right-40 -top-28 h-[520px] w-[520px] rounded-full bg-[#dff28c]/45 blur-3xl" />
          <div className="soft-grid absolute inset-0 rotate-3 rounded-[40px] border border-[#dfe5db] bg-[#edf1e8]" />
          <div className="card absolute inset-x-3 top-5 overflow-hidden p-5 shadow-[0_30px_90px_rgba(35,67,53,.16)] sm:inset-x-8">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#849088]">Monday overview</p><h3 className="display mt-1 text-2xl font-bold">Good morning, Aarav</h3></div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f2a65a] text-sm font-bold text-white">AS</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#1c5c43] p-5 text-white">
                <p className="text-xs font-semibold text-white/65">PLACEMENT READINESS</p>
                <div className="mt-3 flex items-end gap-2"><span className="display text-5xl">72</span><span className="mb-1 text-white/60">/100</span></div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[72%] rounded-full bg-[#dff28c]" /></div>
                <p className="mt-3 text-xs text-white/65">↑ 8 points this month</p>
              </div>
              <div className="rounded-2xl border border-[#e3e7df] bg-[#fbfcf8] p-4">
                <p className="text-xs font-semibold text-[#77827b]">RESUME SCORE</p>
                <div className="mt-2 flex justify-center"><ScoreRing value={84} size={100} /></div>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-[#e3e7df] bg-white p-4">
              <div className="flex items-center justify-between"><p className="font-bold">This week’s focus</p><span className="text-xs font-semibold text-[#1c5c43]">Week 5 of 12</span></div>
              <div className="mt-4 space-y-3">
                {[["Dynamic programming", 70], ["Database indexing", 45], ["Behavioral answers", 30]].map(([label, value]) => (
                  <div key={label as string}>
                    <div className="mb-1.5 flex justify-between text-xs"><span>{label}</span><span className="text-[#7d8781]">{value}%</span></div>
                    <div className="h-1.5 rounded-full bg-[#edf0eb]"><div className="h-full rounded-full bg-[#2c7658]" style={{ width: `${value}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 -left-4 z-10 rounded-2xl border border-[#e1e5de] bg-white p-4 shadow-xl sm:left-0">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0df] text-[#b76a29]"><Bot size={20} /></span><div><p className="text-xs text-[#7b857f]">Mentor insight</p><p className="text-sm font-bold">You’re ready for a mock interview.</p></div></div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#183d2e] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#dff28c]">Everything works together</p>
            <h2 className="display mt-4 text-4xl leading-tight sm:text-5xl">One mentor. Your whole placement journey.</h2>
            <p className="mt-5 text-lg leading-8 text-white/65">No disconnected trackers. Every practice session teaches PrepWise what you need next.</p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group bg-[#183d2e] p-8 transition hover:bg-[#204a39]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/8 text-[#dff28c] transition group-hover:scale-105"><Icon size={23} /></span>
                <h3 className="display mt-7 text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-white/60">{text}</p>
                <span className="mt-6 flex items-center gap-1 text-sm font-semibold text-[#dff28c]">Explore <ChevronRight size={15} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#1c5c43]">A plan that gets smarter</p><h2 className="display mt-4 text-4xl sm:text-5xl">From uncertain to interview-ready.</h2></div>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Show us where you are", "Upload your resume and choose the role you’re aiming for."],
              ["02", "Get your honest baseline", "We map strengths, gaps, and readiness across every placement dimension."],
              ["03", "Follow the next best step", "Your roadmap adapts each week based on real performance—not guesswork."],
            ].map(([number, title, text]) => (
              <div className="card relative p-8" key={number}>
                <span className="display text-6xl text-[#dce3da]">{number}</span><h3 className="display mt-8 text-2xl font-bold">{title}</h3><p className="mt-3 leading-7 text-[#68726d]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="px-6 pb-24 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[36px] bg-[#dff28c] px-7 py-14 text-center sm:px-14">
          <p className="display mx-auto max-w-3xl text-3xl leading-snug sm:text-4xl">“PrepWise stopped me from studying everything and helped me focus on what actually moved my interviews forward.”</p>
          <p className="mt-6 font-bold">Meera K. · SDE Intern, Bengaluru</p>
          <div className="mt-10"><Link href="/login"><Button className="px-8">Start your plan today <ArrowRight size={16} /></Button></Link></div>
        </div>
      </section>

      <footer className="border-t border-[#dde2da] px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row"><Logo /><p className="text-sm text-[#7c857f]">Built for ambitious students. © 2026 PrepWise.</p></div>
      </footer>
    </main>
  );
}

