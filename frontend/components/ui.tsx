import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Button({
  children, className, variant = "primary", loading, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost"; loading?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:opacity-60",
        variant === "primary" && "bg-[#1c5c43] text-white hover:bg-[#164a36] shadow-[0_8px_20px_rgba(28,92,67,.18)]",
        variant === "secondary" && "border border-[#dbe1da] bg-white text-[#24312c] hover:border-[#1c5c43]",
        variant === "ghost" && "text-[#66706b] hover:bg-[#edf0e9] hover:text-[#1c5c43]",
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Badge({ children, tone = "green", className }: {
  children: React.ReactNode; tone?: "green" | "orange" | "gray" | "red"; className?: string;
}) {
  const tones = {
    green: "bg-[#e5f3eb] text-[#1c5c43]",
    orange: "bg-[#fff0df] text-[#9b581f]",
    gray: "bg-[#eef0ec] text-[#66706b]",
    red: "bg-[#fde8e5] text-[#a84236]",
  };
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

export function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-xl border border-[#dfe4dc] bg-white px-4 py-3 outline-none transition placeholder:text-[#a2aaa4] focus:border-[#1c5c43] focus:ring-4 focus:ring-[#1c5c43]/8", props.className)} />;
}

export function ScoreRing({ value, size = 104 }: { value: number; size?: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e9ece6" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1c5c43" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
      </svg>
      <div className="absolute text-center"><span className="display text-3xl font-bold">{value}</span><span className="text-xs text-[#7c857f]">%</span></div>
    </div>
  );
}

