import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#f43f5e"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-xl text-xs shadow-xl border border-slate-700/80">
        <p className="font-bold text-indigo-300">{item.name}</p>
        <p className="text-white font-medium mt-0.5">Competency Level: <span className="text-emerald-400 font-bold">{item.value}%</span></p>
      </div>
    );
  }
  return null;
};

export default function CompetencyPieChart({ graph, height = 340 }) {
  const data = (graph || []).map((s) => ({ 
    name: s.skill, 
    value: Math.round((s.level || 0) * 100) 
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={105}
          paddingAngle={4}
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ fontSize: "11px", paddingTop: "12px", fontWeight: 500 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
