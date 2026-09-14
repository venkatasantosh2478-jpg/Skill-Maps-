import React, { useEffect, useState } from "react";
import { getMyProfile, generateResumeAnalysis, updateProfile, addActivity } from "@/lib/skillMap";
import { 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  Lightbulb, 
  XCircle, 
  FileText, 
  Briefcase, 
  CheckCircle, 
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SAMPLE_JDS = [
  {
    title: "Senior Full Stack Engineer (React + Node)",
    text: `We are looking for a Senior Full Stack Engineer experienced with React, TypeScript, Node.js, and PostgreSQL. 
Requirements:
- 3+ years architecting scalable web applications.
- Strong proficiency in Docker containerization and CI/CD pipelines.
- Hands-on experience with GraphQL APIs, Redis caching, and AWS/GCP cloud services.
- Experience tuning SQL queries and designing relational schemas.
- Strong communication and mentoring skills.`
  },
  {
    title: "Cloud & DevOps Infrastructure Engineer",
    text: `Seeking a DevOps / Cloud Engineer to manage our Kubernetes clusters and Terraform infrastructure.
Requirements:
- Proven experience with Kubernetes, Helm, Docker, and Linux internals.
- Infrastructure as Code (IaC) using Terraform or Pulumi.
- Experience configuring Prometheus and Grafana telemetry.
- Familiarity with secure microservices architecture and zero-trust networking.`
  }
];

export default function ResumeCheck() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobDesc, setJobDesc] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    const p = await getMyProfile();
    setProfile(p);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const analyze = async () => {
    if (!profile?.resumeText || !jobDesc.trim()) return;
    setAnalyzing(true);
    const result = await generateResumeAnalysis(profile.resumeText, jobDesc);
    setAnalysis(result);
    const newLog = addActivity(profile.activityLog, `Ran AI resume intelligence check against job description`, "", 0);
    const updated = await updateProfile(profile.id, { missingSkills: result.missingSkills || [], activityLog: newLog });
    setProfile({ ...profile, ...updated });
    setAnalyzing(false);
  };

  const copySuggestion = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm animate-pulse">
          <Sparkles className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500">Loading resume intelligence engine...</p>
      </div>
    );
  }

  if (!profile) return <div className="p-8 text-slate-500">Complete onboarding first.</div>;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            ATS Keyword & Compatibility Scanner
          </span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">AI Resume Intelligence</h1>
        <p className="text-slate-500 text-sm mt-1">
          Evaluate your resume against real job descriptions to identify missing skills, ATS format pitfalls, and high-impact rewrite suggestions.
        </p>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm">Your Active Resume</h3>
                  <p className="text-[11px] text-slate-400">Stored in your student profile</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                {profile.resumeText ? `${profile.resumeText.split(/\s+/).filter(Boolean).length} words` : "Empty"}
              </span>
            </div>
            <textarea
              value={profile.resumeText || ""}
              onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
              placeholder="Paste your plain text resume here (including experience, skills, and projects)..."
              rows={12}
              className="w-full text-xs sm:text-sm font-mono p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50/50 leading-relaxed text-slate-700"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Changes are saved automatically when analyzing.</p>
        </div>

        {/* Job Description Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm">Target Job Description</h3>
                  <p className="text-[11px] text-slate-400">Paste or load sample requirements</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {SAMPLE_JDS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setJobDesc(s.text)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    Sample {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the target job description or requirements here..."
              rows={12}
              className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none bg-slate-50/50 leading-relaxed text-slate-700"
            />
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              {jobDesc ? `${jobDesc.split(/\s+/).filter(Boolean).length} words detected` : "Paste a JD to unlock comparison"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={analyze}
          disabled={analyzing || !jobDesc.trim() || !profile?.resumeText}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:opacity-50 flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Scanning Resume & Extracting Competency Alignment...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span>Run Deep AI Resume & ATS Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-6 pt-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-indigo-900/40">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <CheckCircle className="h-3 w-3 text-emerald-400" /> Scan Completed
              </span>
              <h3 className="font-heading text-xl font-bold text-white">ATS Compatibility Breakdown</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Gemini detected <strong className="text-white">{analysis.missingSkills?.length || 0} missing target keywords</strong> and formatted structural improvements.
              </p>
            </div>
            <button
              onClick={() => navigate("/opportunities")}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 text-xs font-bold hover:bg-indigo-50 flex items-center gap-2 shrink-0 transition-colors shadow-sm"
            >
              <span>Explore Matched Roles</span> <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Missing Skills Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base">Missing Skills & Keywords</h3>
                    <p className="text-xs text-slate-400">Crucial terms expected by recruiters</p>
                  </div>
                </div>

                {analysis.missingSkills?.length ? (
                  <div className="space-y-2">
                    {analysis.missingSkills.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                        <div className="flex items-center gap-2 text-rose-900 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          <span>{s}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-rose-600 bg-white px-2 py-0.5 rounded shadow-2xs">
                          Missing
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    No critical missing skills found!
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-100">
                These keywords are automatically synchronized to your recommended career opportunities.
              </p>
            </div>

            {/* ATS Compliance Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base">ATS Compliance Pitfalls</h3>
                    <p className="text-xs text-slate-400">Parsing and readability hurdles</p>
                  </div>
                </div>

                {analysis.atsIssues?.length ? (
                  <ul className="space-y-2.5">
                    {analysis.atsIssues.map((s, i) => (
                      <li key={i} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    No major ATS parsing issues flagged!
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-100">
                Standardizing bullet structures ensures automated parsers don't drop your experience.
              </p>
            </div>

            {/* High-Impact Rewrites */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base">Impact Rewrites</h3>
                    <p className="text-xs text-slate-400">Action-driven metric bullet points</p>
                  </div>
                </div>

                {analysis.rewriteSuggestions?.length ? (
                  <div className="space-y-2.5">
                    {analysis.rewriteSuggestions.map((s, i) => (
                      <div key={i} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700 leading-relaxed group relative">
                        <p className="pr-6">{s}</p>
                        <button
                          onClick={() => copySuggestion(s, i)}
                          title="Copy bullet point"
                          className="absolute top-2 right-2 p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-8 text-center">No rewrite suggestions generated.</p>
                )}
              </div>
              <p className="text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-100">
                Click the copy icon on any bullet point to quickly paste it into your resume.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
