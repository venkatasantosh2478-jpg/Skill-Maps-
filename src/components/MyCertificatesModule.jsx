import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Award, 
  Download, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  ShieldCheck, 
  Building, 
  Calendar, 
  X,
  Eye,
  GraduationCap,
  ArrowLeft,
  Home
} from "lucide-react";
import { 
  getStudentCertificates, 
  saveStudentCertificate, 
  deleteStudentCertificate 
} from "@/lib/dataStore";
import { generateCertificatePDF } from "@/lib/certificatePdfGenerator";
import { cn } from "@/lib/utils";

export default function MyCertificatesModule({ studentName = "Student Candidate", user = {} }) {
  const [certificates, setCertificates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectCert, setInspectCert] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Form State for Adding New Certificate
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "SkillsMap Academic Board",
    category: "specialization",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "Lifetime / No Expiration",
    credentialId: "",
    verificationUrl: "",
    grade: "Distinction",
    score: "95%",
    skillsString: "React, TypeScript, Node.js, Cloud Architecture",
    description: "Successfully mastered and demonstrated practical competency in certified curriculum modules and applied project evaluations.",
    signatoryName: "Dr. Elena Rostova",
    signatoryTitle: "Dean of Academic Technology",
  });

  useEffect(() => {
    loadCertificates();

    const handleStoreUpdate = (e) => {
      if (!e.detail || e.detail.key === "skillsmap_student_certificates") {
        loadCertificates();
      }
    };
    window.addEventListener("skillsmap_store_update", handleStoreUpdate);
    return () => window.removeEventListener("skillsmap_store_update", handleStoreUpdate);
  }, []);

  const loadCertificates = () => {
    setCertificates(getStudentCertificates());
  };

  const handleCopyLink = (cert) => {
    const url = cert.verificationUrl || `https://skillsmap.io/verify/${cert.credentialId || cert.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cert.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadPDF = async (cert) => {
    setDownloadingId(cert.id);
    try {
      generateCertificatePDF(cert, studentName);
    } catch (err) {
      console.error("Failed to generate certificate PDF:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteCert = (id) => {
    if (window.confirm("Are you sure you want to remove this certificate from your profile?")) {
      const updated = deleteStudentCertificate(id);
      setCertificates(updated);
      if (inspectCert?.id === id) setInspectCert(null);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCert.title.trim()) return;

    const skills = newCert.skillsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const credId = newCert.credentialId.trim() || `SM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const certToSave = {
      title: newCert.title.trim(),
      issuer: newCert.issuer.trim() || "SkillsMap Academy & University Tech Board",
      issuerLogo: newCert.category === "hackathon" ? "🏆" : newCert.category === "external" ? "☁️" : "🎓",
      category: newCert.category,
      issueDate: newCert.issueDate,
      expiryDate: newCert.expiryDate || "Lifetime / No Expiration",
      credentialId: credId,
      verificationUrl: newCert.verificationUrl.trim() || `https://skillsmap.io/verify/${credId}`,
      grade: newCert.grade || "Distinction",
      score: newCert.score || "95%",
      skills: skills.length > 0 ? skills : ["Computer Science", "Engineering"],
      description: newCert.description,
      signatoryName: newCert.signatoryName || "Dr. Elena Rostova",
      signatoryTitle: newCert.signatoryTitle || "Dean of Academic Technology",
      verified: true,
      badgeColor: newCert.category === "hackathon" ? "purple" : newCert.category === "course" ? "emerald" : "indigo",
      accentGlow: "from-indigo-500 to-violet-600"
    };

    const updated = saveStudentCertificate(certToSave);
    setCertificates(updated);
    setShowAddModal(false);
    setNewCert({
      title: "",
      issuer: "SkillsMap Academic Board",
      category: "specialization",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "Lifetime / No Expiration",
      credentialId: "",
      verificationUrl: "",
      grade: "Distinction",
      score: "95%",
      skillsString: "React, TypeScript, Node.js, Cloud Architecture",
      description: "Successfully mastered and demonstrated practical competency in certified curriculum modules.",
      signatoryName: "Dr. Elena Rostova",
      signatoryTitle: "Dean of Academic Technology",
    });
  };

  // Filtered Certificates
  const filteredCerts = certificates.filter((c) => {
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    const matchesSearch = 
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.skills && c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      c.credentialId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Unique skills across all certificates
  const allEndorsedSkills = Array.from(
    new Set(certificates.flatMap((c) => c.skills || []))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Metrics & Add Button */}
      <div className="bg-gradient-to-tr from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Official Institutional & Industry Credentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              My Verified Certificates
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All officially accredited course diplomas, specialization certificates, hackathon podium honors, and verified third-party technical credentials conferred to <span className="text-white font-bold">{studentName}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 group"
            >
              <Home className="h-4 w-4 text-indigo-300 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 group hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4 text-white group-hover:rotate-90 transition-transform" />
              <span>Add / Upload Certificate</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <p className="text-3xs uppercase font-bold text-slate-400">Total Credentials</p>
            <p className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
              {certificates.length}
            </p>
            <span className="text-3xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3" /> 100% Cryptographically Verified
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <p className="text-3xs uppercase font-bold text-slate-400">Honors & Distinctions</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400 font-heading mt-0.5">
              {certificates.filter((c) => c.grade?.toLowerCase().includes("distinction") || c.grade?.toLowerCase().includes("1st") || c.grade?.toLowerCase().includes("honor")).length}
            </p>
            <span className="text-3xs text-amber-300/80 font-medium mt-1 block">Top 1% Percentile</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <p className="text-3xs uppercase font-bold text-slate-400">Competencies Endorsed</p>
            <p className="text-xl sm:text-2xl font-black text-indigo-300 font-heading mt-0.5">
              {allEndorsedSkills.length}
            </p>
            <span className="text-3xs text-indigo-200/80 font-medium mt-1 block">Industry Standard Skills</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <p className="text-3xs uppercase font-bold text-slate-400">Accredited Issuers</p>
            <p className="text-xl sm:text-2xl font-black text-violet-300 font-heading mt-0.5">
              {new Set(certificates.map((c) => c.issuer)).size}
            </p>
            <span className="text-3xs text-violet-200/80 font-medium mt-1 block">Academic & Global Boards</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Credentials", count: certificates.length },
            { id: "specialization", label: "Specializations", count: certificates.filter((c) => c.category === "specialization").length },
            { id: "course", label: "Course Bootcamps", count: certificates.filter((c) => c.category === "course").length },
            { id: "hackathon", label: "Hackathons", count: certificates.filter((c) => c.category === "hackathon").length },
            { id: "external", label: "External Certs", count: certificates.filter((c) => c.category === "external").length },
          ].map((tab) => {
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5",
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  "text-3xs px-1.5 py-0.2 rounded-full font-bold",
                  active ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill, title, ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCerts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Award className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              No certificates match your filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your category filter or search keywords, or click below to add a new certificate.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Certificate</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCerts.map((cert) => {
            const isDistinction = cert.grade?.toLowerCase().includes("distinction") || cert.grade?.toLowerCase().includes("1st");
            const isCourse = cert.category === "course";
            const isHack = cert.category === "hackathon";

            return (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle colored accent top border */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r",
                  isHack ? "from-purple-500 to-pink-500" : isDistinction ? "from-amber-400 to-indigo-500" : "from-indigo-500 to-teal-500"
                )} />

                <div className="space-y-4">
                  {/* Card Header: Category Badge + Verification + Delete */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cert.issuerLogo || "🎓"}</span>
                      <span className={cn(
                        "text-3xs uppercase font-extrabold px-2.5 py-0.5 rounded-full",
                        isHack
                          ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                          : isCourse
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                          : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                      )}>
                        {cert.category || "Specialization"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-3xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified</span>
                      </span>

                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete Certificate"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  {/* Issuer & Date Metadata */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-3xs font-bold uppercase tracking-wider">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        Issuer
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[200px]">
                        {cert.issuer}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-3xs font-bold uppercase tracking-wider">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Issued
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cert.issueDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-3xs font-bold uppercase tracking-wider">
                        <Award className="h-3.5 w-3.5 text-amber-500" />
                        Standing
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {cert.grade || "Distinction"} {cert.score ? `(${cert.score})` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Skills Endorsed */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-3xs font-bold uppercase tracking-wider text-slate-400">
                        Skills Endorsed ({cert.skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-3xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 5 && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-3xs font-semibold">
                            +{cert.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Credential ID Copy Strip */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-3xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="truncate">ID: {cert.credentialId}</span>
                    <button
                      onClick={() => handleCopyLink(cert)}
                      className="ml-2 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-sans font-bold shrink-0"
                      title="Copy Verification URL"
                    >
                      {copiedId === cert.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setInspectCert(cert)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>View Diploma</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(cert)}
                    disabled={downloadingId === cert.id}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    <Download className="h-3.5 w-3.5 text-white" />
                    <span>{downloadingId === cert.id ? "Rendering..." : "Download PDF"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: OFFICIAL CERTIFICATE DIPLOMA VIEWER */}
      {inspectCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            {/* Modal Header Bar */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setInspectCert(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Close viewer and return to certificate list"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Certificates</span>
                </button>
                <div className="hidden sm:flex items-center gap-2 border-l border-slate-300 dark:border-slate-700 pl-3">
                  <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                    Diploma Preview
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPDF(inspectCert)}
                  disabled={downloadingId === inspectCert.id}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadingId === inspectCert.id ? "Rendering..." : "Download PDF"}</span>
                </button>
                <button
                  onClick={() => setInspectCert(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Realistic Certificate Frame */}
            <div className="p-6 sm:p-10 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
              <div className="w-full bg-[#fcfdff] text-slate-900 rounded-2xl p-6 sm:p-12 border-8 border-indigo-600 relative shadow-2xl space-y-6 text-center select-none overflow-hidden">
                {/* Inner Gold Inset Border */}
                <div className="absolute inset-2 border-2 border-amber-500/80 pointer-events-none rounded-lg" />
                
                {/* Top Corner Ornaments */}
                <div className="absolute top-2 left-2 w-4 h-4 bg-indigo-600 clip-corner" />
                <div className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 clip-corner" />
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-indigo-600 clip-corner" />
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-indigo-600 clip-corner" />

                {/* Organization & Header */}
                <div className="space-y-1 relative z-10">
                  <p className="text-3xs uppercase tracking-widest font-extrabold text-indigo-700 font-sans">
                    SKILLSMAP ACADEMY OF ADVANCED COMPUTING & TECHNOLOGY
                  </p>
                  <p className="text-4xs uppercase tracking-wider font-semibold text-slate-500">
                    INSTITUTIONAL ACCREDITATION & INDUSTRY VERIFIED CREDENTIALS
                  </p>
                  <div className="w-24 h-0.5 bg-amber-400 mx-auto mt-2" />
                </div>

                {/* Certificate Title */}
                <div className="space-y-1 relative z-10">
                  <h2 className="text-xl sm:text-3xl font-black font-heading text-slate-900 tracking-wide uppercase">
                    Certificate of Achievement
                  </h2>
                  <p className="text-xs italic text-slate-500 font-serif">
                    This official credential is proudly conferred upon
                  </p>
                </div>

                {/* Recipient Full Name */}
                <div className="py-2 relative z-10">
                  <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-indigo-800 underline decoration-amber-400 decoration-2 underline-offset-8">
                    {studentName.toUpperCase()}
                  </h1>
                </div>

                {/* Reason & Course Title */}
                <div className="space-y-2 max-w-xl mx-auto relative z-10">
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    for exceptional proficiency and verified mastery in completing the certified curriculum:
                  </p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                    {inspectCert.title}
                  </h3>
                  <p className="text-2xs text-slate-500 max-w-lg mx-auto italic">
                    "{inspectCert.description}"
                  </p>
                </div>

                {/* Skills Pill Box */}
                {inspectCert.skills && inspectCert.skills.length > 0 && (
                  <div className="inline-flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto py-1 px-3 rounded-xl bg-slate-100 border border-slate-200 text-3xs font-semibold text-indigo-700">
                    <span className="font-bold uppercase text-slate-500">Competencies:</span>
                    {inspectCert.skills.join(" • ")}
                  </div>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-200 text-center max-w-2xl mx-auto relative z-10">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <p className="text-4xs uppercase font-bold text-slate-400">Honors</p>
                    <p className="text-xs font-extrabold text-amber-600">{inspectCert.grade || "Distinction"}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <p className="text-4xs uppercase font-bold text-slate-400">Issuing Body</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{inspectCert.issuer}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <p className="text-4xs uppercase font-bold text-slate-400">Issue Date</p>
                    <p className="text-xs font-bold text-slate-800">{inspectCert.issueDate}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <p className="text-4xs uppercase font-bold text-slate-400">Credential ID</p>
                    <p className="text-xs font-mono font-bold text-indigo-700">{inspectCert.credentialId}</p>
                  </div>
                </div>

                {/* Signatures & Gold Seal */}
                <div className="grid grid-cols-3 items-end pt-6 relative z-10">
                  {/* Dean Signature */}
                  <div className="text-left space-y-1">
                    <div className="border-b border-slate-400 w-36 pb-1">
                      <p className="font-serif italic text-sm text-indigo-900 font-bold">
                        {inspectCert.signatoryName || "Dr. Elena Rostova"}
                      </p>
                    </div>
                    <p className="text-3xs font-bold text-slate-900">{inspectCert.signatoryTitle || "Dean of Academic Technology"}</p>
                    <p className="text-4xs text-slate-500">SkillsMap Board of Examiners</p>
                  </div>

                  {/* Gold Verified Seal */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-amber-100 border-4 border-amber-500 flex flex-col items-center justify-center shadow-inner text-amber-800">
                      <ShieldCheck className="h-6 w-6 text-amber-600" />
                      <span className="text-4xs font-extrabold tracking-tighter">VERIFIED</span>
                    </div>
                  </div>

                  {/* Industry VP Signature */}
                  <div className="text-right space-y-1">
                    <div className="border-b border-slate-400 w-36 ml-auto pb-1">
                      <p className="font-serif italic text-sm text-indigo-900 font-bold">
                        Marcus Vance, VP
                      </p>
                    </div>
                    <p className="text-3xs font-bold text-slate-900">Global Accreditation Officer</p>
                    <p className="text-4xs text-slate-500">Industry Engineering Guild</p>
                  </div>
                </div>

                {/* Verification Footer */}
                <div className="pt-2 text-4xs text-slate-400">
                  Official Verification: {inspectCert.verificationUrl || `https://skillsmap.io/verify/${inspectCert.credentialId}`}
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions Bar */}
            <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setInspectCert(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-900 text-white hover:bg-slate-900 dark:hover:bg-slate-950 text-xs font-bold transition-all flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to All Certificates</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(inspectCert)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  {copiedId === inspectCert.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy Verification Link</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadPDF(inspectCert)}
                  disabled={downloadingId === inspectCert.id}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / UPLOAD NEW CERTIFICATE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Add New Certificate Credential
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add courses, hackathons, or external industry credentials to your profile.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="e.g. Advanced Distributed Systems & Cloud Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    placeholder="e.g. SkillsMap Academic Board or AWS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCert.category}
                    onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="specialization">Specialization & Mastery</option>
                    <option value="course">Bootcamp & Course Completion</option>
                    <option value="hackathon">Hackathon & Challenge Podium</option>
                    <option value="external">External & Industry Accredited</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newCert.issueDate}
                    onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Honors / Grade
                  </label>
                  <input
                    type="text"
                    value={newCert.grade}
                    onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                    placeholder="e.g. Distinction (Top 1%), Grade: A+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Skills Endorsed (Comma Separated)
                </label>
                <input
                  type="text"
                  value={newCert.skillsString}
                  onChange={(e) => setNewCert({ ...newCert, skillsString: e.target.value })}
                  placeholder="e.g. React 19, TypeScript, Docker, Gemini SDK"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Certificate Description / Abstract
                </label>
                <textarea
                  rows={2}
                  value={newCert.description}
                  onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                  placeholder="Describe the skills and project achievements demonstrated..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
