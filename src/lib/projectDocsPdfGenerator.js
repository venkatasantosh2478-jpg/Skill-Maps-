import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateSystemArchitecturePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // COVER PAGE
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Accent band
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.rect(0, 0, pageWidth, 8, "F");

  // Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("SKILLS MAP PLATFORM", 20, 50);

  doc.setFontSize(16);
  doc.setTextColor(199, 210, 254);
  doc.text("System Architecture & 6-Pillar Technical Specification", 20, 62);

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.5);
  doc.line(20, 70, pageWidth - 20, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(226, 232, 240);
  const introText = [
    "This document provides the formal technical architecture, data contracts,",
    "AI prompt pipelines, and adaptive algorithms for the Skills Map Platform,",
    "covering all six foundational intelligent learning and assessment pillars."
  ];
  doc.text(introText, 20, 85);

  // Metadata Box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 110, pageWidth - 40, 55, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(129, 140, 248);
  doc.text("SPECIFICATION METADATA", 30, 122);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("• Version: 2.5.0 (Production)", 30, 132);
  doc.text("• AI Core: Google Gemini 2.5 Flash (@google/genai)", 30, 140);
  doc.text("• Backend: Express.js (Node.js/ESM/CJS) on Cloud Container", 30, 148);
  doc.text("• Storage & Auth: Google Firebase Firestore & Auth RBAC", 30, 156);

  // 6 Pillars Summary Matrix
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("THE 6 FOUNDATIONAL PILLARS", 20, 185);

  const pillarsList = [
    "1. Previous Learning Recognition & Objective Skill Profiling",
    "2. Personalized Learning Roadmap & Pacing Generator",
    "3. Intelligent Multi-Tier Learning Resource Recommendation",
    "4. Adaptive Assessment Engine & Knowledge Validation",
    "5. Resume Intelligence & Automated Skill Gap Analysis",
    "6. AI Industry Project & Certification Recommendation"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  let yPos = 195;
  pillarsList.forEach((pillar) => {
    doc.text(pillar, 24, yPos);
    yPos += 9;
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Confidential & Proprietary`, 20, pageHeight - 15);

  // PAGE 2: PILLARS 1 & 2
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Header banner
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("PILLARS 1 & 2: RECOGNITION, PROFILING & ROADMAPS", 15, 11);

  // Section 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Previous Learning Recognition & Skill Profiling", 15, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const p1Text = 
    "The Skill Profiling Engine combines raw resume parsing (PDF/TXT via pdf-parse) with a 10-question " +
    "diagnostic technical quiz to calibrate true baseline competencies across 6 axes (Backend, Frontend, " +
    "Architecture, Problem Solving, Database, DevOps). Rather than trusting self-reported estimates, the " +
    "AI evaluates project proof, tech stacks, and quiz accuracy before generating the initial competency graph.";
  doc.text(doc.splitTextToSize(p1Text, pageWidth - 30), 15, 35);

  autoTable(doc, {
    startY: 50,
    head: [["Competency Axis", "Diagnostic Coverage", "Evidence Verification Criteria"]],
    body: [
      ["Backend", "Express middleware, I/O paradigms, REST/gRPC", "Production APIs, Node.js/Python experience"],
      ["Frontend", "React lifecycle, RSC, state mutations", "UI projects, component architecture"],
      ["Architecture", "Microservices, Circuit Breakers, Sagas", "System design artifacts, scalability experience"],
      ["Problem Solving", "BSTs, Knapsack DP, Graph algorithms", "Algorithm competitions, LeetCode / DSA ratings"],
      ["Database", "ACID transactions, NoSQL vs SQL trade-offs", "Indexing, schema design, distributed stores"],
      ["DevOps", "Docker containerization, CI/CD pipelines", "Kubernetes, cloud deployments, infra as code"]
    ],
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 }
  });

  // Section 2
  const sec2Y = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Personalized Learning Roadmap Generator", 15, sec2Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const p2Text = 
    "Generates goal-oriented, phased milestones connecting the student's current radar graph to target " +
    "engineering roles. Includes explicit 'Why Master This Skill' rationale, prerequisite dependencies, " +
    "and real-world portfolio milestone projects with automated pacing.";
  doc.text(doc.splitTextToSize(p2Text, pageWidth - 30), 15, sec2Y + 7);

  autoTable(doc, {
    startY: sec2Y + 20,
    head: [["Roadmap Component", "Technical Specification", "Outcome"]],
    body: [
      ["Phase Structuring", "Multi-phase sequential learning milestones", "Clear 2-4 week progressive sprints"],
      ["Prerequisite Mapping", "DAG-based dependency sequencing", "Prevents jumping ahead without foundations"],
      ["Portfolio Capstone", "GitHub-ready production project per phase", "Verifiable evidence for hiring managers"],
      ["Fatigue Pacing", "Adaptive timetable sync (Morning/Night)", "Optimizes focus vs. burnout trade-offs"]
    ],
    theme: "grid",
    headStyles: { fillColor: [30, 41, 59], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 }
  });

  // PAGE 3: PILLARS 3 & 4
  doc.addPage();
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("PILLARS 3 & 4: RESOURCES & ADAPTIVE ASSESSMENT", 15, 11);

  // Section 3
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("3. Intelligent Learning Resource Recommendation", 15, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const p3Text = 
    "Dynamically queries and filters high-quality, free learning materials across 3 competency tiers " +
    "(Beginner [0.0-0.4], Intermediate [0.4-0.7], Advanced [0.7-1.0]). Formats recommendations into books, " +
    "curated video lectures, official documentation, coding practice platforms, and ELI5 concept breakdowns.";
  doc.text(doc.splitTextToSize(p3Text, pageWidth - 30), 15, 35);

  autoTable(doc, {
    startY: 48,
    head: [["Resource Type", "Coverage Tier", "Integration & Delivery Format"]],
    body: [
      ["Official Docs", "All Tiers", "Direct documentation links with synthesized cheat sheets"],
      ["Video Lectures", "Interactive Vault", "Timestamped video player with interactive note-taking"],
      ["Course Docs & PDF", "8-Module Handbook", "Multi-page printable guides with syntax walkthroughs"],
      ["AI Fit Reasoner", "Personalized", "1-sentence AI explanation of why resource fits student profile"]
    ],
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 }
  });

  // Section 4
  const sec4Y = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("4. Adaptive Assessment & Knowledge Validation", 15, sec4Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const p4Text = 
    "Powers dynamic micro-assessments using real-time Item Response Theory (IRT) principles via Gemini AI. " +
    "Questions scale dynamically in difficulty based on correctness, directly updating central competency scores.";
  doc.text(doc.splitTextToSize(p4Text, pageWidth - 30), 15, sec4Y + 7);

  autoTable(doc, {
    startY: sec4Y + 20,
    head: [["Adaptivity Parameter", "Mathematical Rule / Value", "Behavioral Effect"]],
    body: [
      ["Correct Answer Delta", "+0.15 difficulty (Cap: 1.00)", "Promotes to higher-order architectural questions"],
      ["Incorrect Answer Delta", "-0.15 difficulty (Floor: 0.00)", "Recalibrates to foundational diagnostic concepts"],
      ["Assessment Length", "5 Adaptive Questions per session", "Prevents assessment fatigue while securing statistical validity"],
      ["Radar Synchronization", "Instant Firestore delta commit", "Updates dashboard and unlocks next roadmap modules"]
    ],
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 }
  });

  // PAGE 4: PILLARS 5 & 6
  doc.addPage();
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("PILLARS 5 & 6: RESUME INTELLIGENCE & PROJECT/CERT RECOMMENDATIONS", 15, 11);

  // Section 5
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Resume Intelligence & Skill Gap Analysis", 15, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const p5Text = 
    "Evaluates applicant resumes against standard Applicant Tracking Systems (ATS) algorithms. Computes " +
    "ATS readiness percentage, extracts missing technical/soft skills, identifies weak action verbs, and " +
    "provides one-click ATS-optimized resume formatting and PDF exports.";
  doc.text(doc.splitTextToSize(p5Text, pageWidth - 30), 15, 35);

  autoTable(doc, {
    startY: 48,
    head: [["ATS Metric", "Evaluation Method", "Recommended Corrective Action"]],
    body: [
      ["Keyword Matching", "Target job description vector comparison", "Inject missing hard skills into experience bullet points"],
      ["Formatting Index", "Single-column hierarchy, standard fonts", "Removes multi-column tables and non-standard symbols"],
      ["Action Verb Impact", "Quantified business outcome assessment", "Replace passive duties with measurable metrics (e.g., 'Reduced latency by 40%')"]
    ],
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 }
  });

  // Section 6
  const sec6Y = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("6. AI Project & Certification Recommendation", 15, sec6Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const p6Text = 
    "Maps student skill gaps directly to high-ROI industry certifications (AWS Solutions Architect, CKA, GCP Professional, " +
    "Meta Front-End) and real-world capstone projects, hackathons, and freelance opportunities.";
  doc.text(doc.splitTextToSize(p6Text, pageWidth - 30), 15, sec6Y + 7);

  autoTable(doc, {
    startY: sec6Y + 20,
    head: [["Target Career Track", "Recommended Tier-1 Certifications", "Flagship Portfolio Project"]],
    body: [
      ["Backend Architect", "AWS Certified Solutions Architect, CKA", "Distributed Event-Driven Saga Microservice Platform"],
      ["Full-Stack Engineer", "Meta Front-End Developer, Node.js Certified", "Real-Time Collaborative Canvas with WebSockets"],
      ["Cloud & DevOps", "GCP Professional Cloud DevOps, HashiCorp Terraform", "Multi-Region GitOps CI/CD Infrastructure as Code"],
      ["AI & Data Engineer", "AWS Machine Learning Specialty, Databricks Spark", "RAG Knowledge Base with Vector Embeddings & LLMs"]
    ],
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 }
  });

  // Save PDF
  doc.save("SkillsMap_System_Architecture_Specification.pdf");
}

export function generateStudentPortfolioAuditPDF(studentName = "Learner", targetRole = "Full Stack Engineer", competencyScores = []) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SKILLS MAP: STUDENT AUDIT DOSSIER", 15, 20);

  doc.setFontSize(11);
  doc.setTextColor(199, 210, 254);
  doc.text(`Student: ${studentName} | Career Target: ${targetRole}`, 15, 30);

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Competency Radar Calibration Across 6 Axes", 15, 52);

  const scoresToUse = competencyScores.length > 0 ? competencyScores : [
    { skill: "Backend", level: 0.75, evidence: "Demonstrated Express API middleware mastery & async patterns." },
    { skill: "Frontend", level: 0.70, evidence: "Clean React component hierarchy & Tailwind responsive design." },
    { skill: "Architecture", level: 0.60, evidence: "Understands microservice decoupling and Circuit Breaker pattern." },
    { skill: "Problem Solving", level: 0.65, evidence: "Proficient in BST traversal and Dynamic Programming." },
    { skill: "Database", level: 0.70, evidence: "Strong relational schema design & ACID transaction knowledge." },
    { skill: "DevOps", level: 0.55, evidence: "Docker containerization and basic GitHub Actions pipelines." }
  ];

  const tableBody = scoresToUse.map((s) => [
    s.skill,
    `${Math.round(s.level * 100)}%`,
    s.level >= 0.7 ? "Proficient" : s.level >= 0.4 ? "Intermediate" : "Developing",
    s.evidence || "Verified via diagnostic profiling assessment."
  ]);

  autoTable(doc, {
    startY: 58,
    head: [["Axis", "Score", "Band", "AI Verified Evidence & Analysis"]],
    body: tableBody,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229], fontSize: 9 },
    bodyStyles: { fontSize: 8.5 }
  });

  const nextY = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Targeted Skill Gap & Certification Action Plan", 15, nextY);

  autoTable(doc, {
    startY: nextY + 6,
    head: [["Identified Skill Gap", "Recommended Certification", "Target Project to Build"]],
    body: [
      ["DevOps & Container Orchestration", "Certified Kubernetes Application Developer (CKAD)", "Automated Kubernetes cluster deployment with Helm & ArgoCD"],
      ["Distributed System Architecture", "AWS Certified Solutions Architect - Associate", "Event-Driven Order Processing System with RabbitMQ & Kafka"],
      ["Production Performance Profiling", "Node.js Application Developer Certification (JSNAD)", "High-throughput API benchmark suite with Redis Cache layer"]
    ],
    theme: "grid",
    headStyles: { fillColor: [30, 41, 59], fontSize: 9 },
    bodyStyles: { fontSize: 8.5 }
  });

  // Footer
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official Skills Map Verification Document | Issued: ${new Date().toLocaleDateString()}`, 15, pageHeight - 12);

  doc.save(`${studentName.replace(/\s+/g, "_")}_SkillsMap_Portfolio_Audit.pdf`);
}
