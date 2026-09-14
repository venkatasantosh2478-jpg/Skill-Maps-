import React from "react";
import { cn } from "@/lib/utils";

export function levelColor(level) {
  if (level < 0.35) return "bg-rose-50 text-rose-700 border-rose-200";
  if (level < 0.65) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export function levelLabel(level) {
  if (level < 0.35) return "Foundation";
  if (level < 0.65) return "Developing";
  if (level < 0.85) return "Proficient";
  return "Advanced";
}

export default function SkillBadge({ skill, level, delta }) {
  const pct = Math.round((level || 0) * 100);
  const label = levelLabel(level);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
      <div className="flex items-center gap-2 min-w-36">
        <span className="text-sm font-semibold text-slate-800 tracking-tight">{skill}</span>
        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Visual Progress Bar */}
        <div className="w-full sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-300",
              level < 0.35 ? "bg-rose-500" : level < 0.65 ? "bg-amber-500" : "bg-emerald-500"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {delta ? (
            <span className={cn("text-[11px] font-bold px-1.5 py-0.5 rounded", delta > 0 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50")}>
              {delta > 0 ? "+" : ""}{Math.round(delta * 100)}%
            </span>
          ) : null}
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", levelColor(level))}>
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
