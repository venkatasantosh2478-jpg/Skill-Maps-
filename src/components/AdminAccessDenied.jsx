import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, KeyRound, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AdminAccessDenied() {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToAdmin = () => {
    loginAsDemo("admin");
    navigate("/admin/overview");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 antialiased font-body">
      <div className="max-w-lg w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center backdrop-blur-md">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-3">
          <Lock className="h-3 w-3" />
          Access Denied (403)
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3">
          Administrator Privileges Required
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          The SkillsMap Management Console is restricted strictly to faculty, academic directors, and institution administrators. 
          Your current authenticated profile (<strong className="text-white font-semibold">{user?.email || "Student"}</strong>) has standard student permissions and cannot view or edit system configurations.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-left mb-6 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current User:</span>
            <span className="text-white font-medium">{user?.full_name || "Alex Chen"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Assigned Role:</span>
            <span className="text-amber-400 font-semibold uppercase">{user?.role || "student"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Security Policy:</span>
            <span className="text-rose-400 font-medium">RBAC Admin Enforced</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Student Dashboard
          </button>

          <button
            onClick={handleSwitchToAdmin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-700/70 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <KeyRound className="h-4 w-4 text-amber-400" /> Switch to Admin Account (Santosh / venkatasantosh2478@gmail.com)
          </button>
        </div>
      </div>
    </div>
  );
}
