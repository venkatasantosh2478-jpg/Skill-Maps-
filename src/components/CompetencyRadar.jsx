import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-xl text-xs shadow-xl border border-slate-700/80">
        <p className="font-bold text-indigo-300">{item.payload.skill}</p>
        <p className="text-white font-medium mt-0.5">Competency: <span className="text-emerald-400 font-bold">{item.value}%</span></p>
      </div>
    );
  }
  return null;
};

export default function CompetencyRadar({ graph, height = 340 }) {
  const data = (graph || []).map((s) => ({ 
    skill: s.skill, 
    level: Math.round((s.level || 0) * 100) 
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <PolarAngleAxis 
          dataKey="skill" 
          tick={{ fill: "#334155", fontSize: 12, fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif" }} 
        />
        <PolarRadiusAxis 
          domain={[0, 100]} 
          tick={{ fill: "#94a3b8", fontSize: 10 }} 
          angle={90} 
        />
        <Radar 
          name="Competency" 
          dataKey="level" 
          stroke="#4f46e5" 
          strokeWidth={2.5}
          fill="#6366f1" 
          fillOpacity={0.25}
          dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 6, fill: "#4338ca", strokeWidth: 2, stroke: "#ffffff" }}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
