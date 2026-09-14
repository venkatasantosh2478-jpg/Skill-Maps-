import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const current = payload.find(p => p.dataKey === "current")?.value || 0;
    const target = payload.find(p => p.dataKey === "target")?.value || 0;
    const gap = target - current;
    return (
      <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-700/80">
        <p className="font-bold text-slate-100 mb-1">{label}</p>
        <div className="space-y-0.5">
          <p className="flex items-center justify-between gap-4 text-indigo-300">
            <span>Current:</span>
            <span className="font-semibold text-white">{current}%</span>
          </p>
          <p className="flex items-center justify-between gap-4 text-slate-300">
            <span>Target:</span>
            <span className="font-semibold text-white">{target}%</span>
          </p>
          <p className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700 font-semibold">
            <span>Gap:</span>
            <span className={gap > 0 ? "text-amber-400" : "text-emerald-400"}>{gap > 0 ? `-${gap}%` : "Mastered"}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function SkillGapChart({ competencyGraph, roadmap }) {
  const milestones = roadmap?.milestones || [];
  const targetMap = {};
  milestones.forEach((m) => { targetMap[m.skill] = m.targetLevel; });

  const data = (competencyGraph || []).map((s) => ({
    skill: s.skill,
    current: Math.round((s.level || 0) * 100),
    target: targetMap[s.skill] != null ? Math.round(targetMap[s.skill] * 100) : 90,
  }));

  const avgGap = data.length ? Math.round(data.reduce((sum, d) => sum + (d.target - d.current), 0) / data.length) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-heading text-lg font-bold text-slate-900">Career Goal Skill Gap</h2>
          <p className="text-xs text-slate-400">Comparing your proficiency vs target industry benchmarks</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-indigo-600 shadow-2xs" />
            <span className="text-slate-700">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-indigo-200 border border-indigo-300" />
            <span className="text-slate-500">Benchmark Target</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-[11px]">
            Avg Gap: {avgGap}%
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4} barCategoryGap="24%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="skill" 
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} 
            angle={-15} 
            textAnchor="end" 
            height={55} 
            interval={0} 
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: "#94a3b8", fontSize: 10 }} 
            unit="%" 
          />
          <Tooltip content={<CustomBarTooltip />} />
          <Bar dataKey="current" name="Current" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={24} />
          <Bar dataKey="target" name="Target" fill="#c7d2fe" radius={[6, 6, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
