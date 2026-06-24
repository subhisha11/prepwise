import { Sparkles } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? "bg-[#dff28c] text-[#1c5c43]" : "bg-[#1c5c43] text-white"}`}>
        <Sparkles size={18} />
      </span>
      <span className={`display text-xl font-bold tracking-tight ${light ? "text-white" : "text-[#19231f]"}`}>PrepWise</span>
    </div>
  );
}

