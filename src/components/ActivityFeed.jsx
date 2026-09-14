import React from "react";
import { Activity } from "lucide-react";

export default function ActivityFeed({ log }) {
  if (!log || !log.length) {
    return <p className="text-sm text-slate-400">No activity yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {log.slice(0, 8).map((entry, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="mt-0.5 h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
            <Activity className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700">{entry.action}</p>
            <p className="text-xs text-slate-400">
              {entry.skillAffected ? `${entry.skillAffected}` : ""}
              {entry.skillAffected && entry.delta ? " · " : ""}
              {entry.delta ? `${entry.delta > 0 ? "+" : ""}${Math.round(entry.delta * 100)}%` : ""}
              {" · "}
              {new Date(entry.date).toLocaleDateString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}