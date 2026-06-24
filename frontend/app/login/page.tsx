"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { api, setToken } from "@/lib/api";
import { Button, Field } from "@/components/ui";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const result = await api<{ access_token: string }>(register ? "/auth/register" : "/auth/login", {
        method: "POST", body: JSON.stringify(payload),
      });
      setToken(result.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally { setLoading(false); }
  }

  async function demoLogin() {
    setLoading(true);
    try {
      const result = await api<{ access_token: string }>("/auth/login", {
        method: "POST", body: JSON.stringify({ email: "demo@prepwise.ai", password: "Demo@123" }),
      });
      setToken(result.access_token);
      router.push("/dashboard");
    } catch (err) { setError(err instanceof Error ? err.message : "Backend is not running"); }
    finally { setLoading(false); }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden overflow-hidden bg-[#183d2e] p-12 text-white lg:flex lg:flex-col">
        <Logo light />
        <div className="my-auto max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#dff28c]"><Sparkles size={14} /> A smarter way to prepare</span>
          <h1 className="display mt-8 text-6xl leading-[1.02]">Your placement journey deserves a plan built around <em className="text-[#dff28c]">you.</em></h1>
          <div className="mt-10 space-y-4 text-white/70">
            {["Know exactly what to learn next", "Practice with an AI interviewer", "Track real placement readiness"].map(item => <p className="flex items-center gap-3" key={item}><span className="grid h-6 w-6 place-items-center rounded-full bg-[#dff28c] text-[#183d2e]"><Check size={14} /></span>{item}</p>)}
          </div>
        </div>
        <p className="text-sm text-white/40">PrepWise · Built for the leap from campus to career.</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm text-[#6b756f] hover:text-[#1c5c43]"><ArrowLeft size={16} /> Back to home</Link>
          <div className="mb-10 lg:hidden"><Logo /></div>
          <h2 className="display text-4xl font-bold">{register ? "Create your account" : "Welcome back"}</h2>
          <p className="mt-3 text-[#737d77]">{register ? "Your adaptive placement plan starts here." : "Continue building your placement momentum."}</p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            {register && <div><label className="mb-2 block text-sm font-semibold">Full name</label><Field name="full_name" placeholder="Aarav Sharma" required /></div>}
            <div><label className="mb-2 block text-sm font-semibold">Email address</label><Field name="email" type="email" placeholder="you@college.edu" required /></div>
            <div><label className="mb-2 block text-sm font-semibold">Password</label><Field name="password" type="password" placeholder="At least 8 characters" required minLength={8} /></div>
            {register && <div><label className="mb-2 block text-sm font-semibold">Target role</label><Field name="target_role" placeholder="Backend Engineer" defaultValue="Software Engineer" /></div>}
            {error && <p className="rounded-xl bg-[#fde8e5] px-4 py-3 text-sm text-[#a84236]">{error}</p>}
            <Button loading={loading} className="w-full py-3.5">{register ? "Create free account" : "Sign in"}</Button>
          </form>
          {!register && <><div className="my-5 flex items-center gap-3 text-xs text-[#969e99]"><span className="h-px flex-1 bg-[#e3e7e1]" /> OR <span className="h-px flex-1 bg-[#e3e7e1]" /></div><Button variant="secondary" loading={loading} onClick={demoLogin} className="w-full">Enter demo workspace</Button></>}
          <p className="mt-7 text-center text-sm text-[#737d77]">{register ? "Already have an account?" : "New to PrepWise?"} <button className="font-bold text-[#1c5c43]" onClick={() => { setRegister(!register); setError(""); }}>{register ? "Sign in" : "Create an account"}</button></p>
        </div>
      </section>
    </main>
  );
}

