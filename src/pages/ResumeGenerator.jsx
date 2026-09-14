import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { 
  FileText, 
  Download, 
  Printer, 
  User, 
  Code2, 
  Mail, 
  Phone, 
  MapPin, 
  Github
} from "lucide-react";
import { getMyProfile } from "@/lib/skillMap";
import { cn } from "@/lib/utils";

export default function ResumeGenerator() {
  const [profile, setProfile] = useState(null);
  const [template, setTemplate] = useState("modern"); // 'modern', 'classic', 'minimal'
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef(null);

  // Resume form state
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "Alex Chen",
      jobTitle: "Full Stack Software Engineer",
      email: "alex.chen@university.edu",
      phone: "+1 (555) 349-2810",
      location: "San Francisco, CA",
      github: "github.com/alexchen-dev",
      linkedin: "linkedin.com/in/alexchen",
      website: "alexchen.dev",
      summary: "Results-driven Software Engineering student with hands-on experience designing and deploying scalable web services, RESTful APIs, and distributed architectures. Passionate about cloud containerization, reactive state machines, and high-reliability full-stack systems."
    },
    skills: {
      languages: "JavaScript (ES6+), TypeScript, Python, SQL, HTML5/CSS3",
      frameworks: "React, Node.js, Express, Tailwind CSS, Next.js, Redux",
      tools: "Docker, Git, PostgreSQL, Redis, Vite, Jest, Playwright, Linux",
      concepts: "System Design, RESTful API Architecture, CI/CD, Data Structures, Microservices"
    },
    experience: [
      {
        id: "exp_1",
        title: "Software Engineering Intern",
        company: "Nexus Cloud Labs",
        location: "Remote",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Engineered high-throughput REST APIs with Node.js and Redis cache-aside caching, lowering endpoint latency by 42%.",
          "Collaborated with senior architects to containerize 4 core microservices using Docker multi-stage builds.",
          "Implemented comprehensive end-to-end integration test suites using Playwright, elevating code coverage to 89%."
        ]
      },
      {
        id: "exp_2",
        title: "Undergraduate Research Assistant",
        company: "Distributed Systems Lab",
        location: "San Francisco, CA",
        startDate: "Jan 2025",
        endDate: "May 2025",
        bullets: [
          "Developed telemetry monitoring dashboards in React and D3.js tracking 100+ simulated cluster nodes.",
          "Benchmarked database query latency under heavy concurrency workloads using PostgreSQL explain plans."
        ]
      }
    ],
    projects: [
      {
        id: "proj_1",
        name: "SkillsMap — AI Competency Engine",
        tech: "React, Vite, Node.js, Tailwind CSS, Gemini AI",
        link: "github.com/alexchen/skills-map",
        description: "Built an adaptive career roadmap and skill-mapping platform supporting personalized milestone tracking, real-time code evaluation, and automated syllabus generation."
      },
      {
        id: "proj_2",
        name: "Distributed Task Queue & PubSub Service",
        tech: "Node.js, Redis, Docker, PostgreSQL",
        link: "github.com/alexchen/dist-queue",
        description: "Architected an idempotent asynchronous worker queue with exponential backoff retries, dead-letter exchanges, and rate-limiting middleware handling 5,000+ jobs/min."
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Science in Computer Science",
        institution: "Metropolitan University",
        location: "San Francisco, CA",
        gradDate: "Expected May 2026",
        gpa: "3.85 / 4.0",
        details: "Dean's Honor List (All Semesters). Coursework: Data Structures, Distributed Systems, Cloud Architecture."
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect Associate (2025)",
      "SkillsMap Full-Stack Cloud Competency Badge — Platinum Rank #3"
    ]
  });

  useEffect(() => {
    async function initProfile() {
      const p = await getMyProfile();
      if (p) {
        setProfile(p);
        setResumeData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            fullName: p.name || prev.personal.fullName,
            email: p.email || prev.personal.email,
            jobTitle: p.careerGoal || prev.personal.jobTitle
          }
        }));
      }
    }
    initProfile();
  }, []);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setDownloading(true);

    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.personal.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (error) {
      console.error("Failed to generate resume PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              CAREER INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">· ATS-Compliant PDF</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <FileText className="h-8 w-8 text-indigo-600" />
            ATS Resume Generator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Build, edit, and export an industry-standard technical resume customized with your roadmap competencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-500" /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Rendering PDF..." : "Download Resume (PDF)"}
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Resume Editor Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Template Selector */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-3">
              Resume Layout Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "modern", label: "Modern Slate", desc: "Crisp headers & accents" },
                { id: "classic", label: "Classic Executive", desc: "Traditional academic" },
                { id: "minimal", label: "Clean Minimal", desc: "High density ATS" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all",
                    template === t.id
                      ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-white font-bold ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <p className="text-xs">{t.label}</p>
                  <p className="text-[10px] text-slate-400 font-normal">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Details Form */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-4 w-4 text-indigo-600" /> Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personal.fullName}
                  onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, fullName: e.target.value } })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Target Role Title</label>
                <input
                  type="text"
                  value={resumeData.personal.jobTitle}
                  onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, jobTitle: e.target.value } })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={resumeData.personal.email}
                  onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, email: e.target.value } })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Phone</label>
                <input
                  type="text"
                  value={resumeData.personal.phone}
                  onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, phone: e.target.value } })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Location</label>
                <input
                  type="text"
                  value={resumeData.personal.location}
                  onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, location: e.target.value } })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">GitHub</label>
                <input
                  type="text"
                  value={resumeData.personal.github}
                  onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, github: e.target.value } })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Executive Summary</label>
              <textarea
                rows={3}
                value={resumeData.personal.summary}
                onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, summary: e.target.value } })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-indigo-600" /> Technical Competencies
            </h2>
            <div>
              <label className="text-[11px] font-semibold text-slate-500">Programming Languages</label>
              <input
                type="text"
                value={resumeData.skills.languages}
                onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, languages: e.target.value } })}
                className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500">Frameworks & Libraries</label>
              <input
                type="text"
                value={resumeData.skills.frameworks}
                onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, frameworks: e.target.value } })}
                className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500">Developer Tools & Cloud</label>
              <input
                type="text"
                value={resumeData.skills.tools}
                onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, tools: e.target.value } })}
                className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live A4 Printable Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 bg-slate-200/60 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-300 dark:border-slate-800 overflow-x-auto">
            {/* The A4 Resume Node */}
            <div
              ref={resumeRef}
              className={cn(
                "w-[210mm] min-h-[297mm] mx-auto bg-white text-slate-900 p-10 sm:p-12 shadow-2xl transition-all font-sans antialiased text-[12px] leading-relaxed",
                template === "modern" ? "border-t-8 border-indigo-600" : template === "classic" ? "border-t-4 border-slate-800 font-serif" : "border border-slate-200"
              )}
              style={{ minWidth: "210mm" }}
            >
              {/* Header */}
              <div className="border-b border-slate-200 pb-5 mb-5">
                <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                  {resumeData.personal.fullName}
                </h1>
                <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                  {resumeData.personal.jobTitle}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-slate-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-slate-400" /> {resumeData.personal.email}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" /> {resumeData.personal.phone}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" /> {resumeData.personal.location}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Github className="h-3 w-3 text-slate-400" /> {resumeData.personal.github}
                  </span>
                </div>
              </div>

              {/* Summary */}
              {resumeData.personal.summary && (
                <div className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {resumeData.personal.summary}
                  </p>
                </div>
              )}

              {/* Technical Skills */}
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
                  Technical Competencies
                </h2>
                <div className="space-y-1 text-[11px] text-slate-800">
                  <p><strong>Languages:</strong> {resumeData.skills.languages}</p>
                  <p><strong>Frameworks & Libraries:</strong> {resumeData.skills.frameworks}</p>
                  <p><strong>Developer Tools & Cloud:</strong> {resumeData.skills.tools}</p>
                  <p><strong>Core Concepts:</strong> {resumeData.skills.concepts}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2.5">
                  Work & Internship Experience
                </h2>
                <div className="space-y-3.5">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-slate-900 text-xs">
                          {exp.title} <span className="font-normal text-slate-600">· {exp.company}</span>
                        </h3>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {exp.startDate} – {exp.endDate} | {exp.location}
                        </span>
                      </div>
                      <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-700 space-y-0.5">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2.5">
                  Key Engineering Projects
                </h2>
                <div className="space-y-3">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-slate-900 text-xs">
                          {proj.name}
                        </h3>
                        <span className="text-[10px] text-indigo-600 font-mono">
                          {proj.link}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium italic mt-0.5">
                        Technologies: {proj.tech}
                      </p>
                      <p className="text-[11px] text-slate-700 mt-1">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
                  Education & Academic Standing
                </h2>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-slate-900">{edu.degree}</strong>
                      <span className="text-[10px] text-slate-500">{edu.gradDate}</span>
                    </div>
                    <p className="text-slate-700">{edu.institution} · GPA: {edu.gpa}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{edu.details}</p>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
                  Certifications & Honors
                </h2>
                <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-0.5">
                  {resumeData.certifications.map((cert, cIdx) => (
                    <li key={cIdx}>{cert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
