import { jsPDF } from "jspdf";

/**
 * Returns structured study note content for a given skill/milestone.
 */
export function getSkillStudyNotes(skill, profile = {}) {
  const goal = profile?.careerGoal || profile?.track || "Software Engineer";

  return {
    skill,
    title: `${skill} — Comprehensive Study Notes & Architectural Cheatsheet`,
    goal,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    sections: [
      {
        heading: "1. Core Conceptual Architecture",
        bullets: [
          `Fundamental paradigm and lifecycle models of ${skill}.`,
          `State management, memory allocations, and performance optimization guarantees.`,
          `High-cohesion, low-coupling design principles tailored for production deployments.`,
          `Concurrency, asynchronous task orchestration, and error resilience boundaries.`
        ]
      },
      {
        heading: "2. Essential Implementation Patterns & Syntax",
        bullets: [
          `Pattern A: Factory & Dependency Injection patterns for modular unit isolation.`,
          `Pattern B: Declarative pipeline transformations with strict typing and schema validation.`,
          `Pattern C: Idempotent operations, retry backoffs with jitter, and circuit-breaker safeguards.`,
          `Pattern D: Resource cleanup, connection pooling, and deterministic garbage reclamation.`
        ]
      },
      {
        heading: "3. Industry Best Practices & Antipatterns",
        bullets: [
          `NEVER mix mutation states inside pure computation routines or hooks.`,
          `ALWAYS enforce defensive bounds checking, input sanitization, and structured error logs.`,
          `DO benchmark latency percentiles (p95, p99) under synthetic stress testing.`,
          `DO implement observability metrics, distributed tracing spans, and healthcheck probes.`
        ]
      },
      {
        heading: "4. Rapid-Fire Technical Interview Questions",
        bullets: [
          `Q: How does ${skill} achieve horizontal scale compared to monolithic alternatives?\n   A: By isolating stateless worker nodes behind routing load balancers with decentralized state stores.`,
          `Q: What are the primary bottlenecks encountered under high throughput in ${skill}?\n   A: Lock contention, unindexed query scans, memory buffer saturation, and excessive context switching.`,
          `Q: How do you verify code quality in production CI/CD for ${skill}?\n   A: Automated unit suites, integration regression harness, static AST linter analysis, and canary rollouts.`
        ]
      },
      {
        heading: "5. Recommended Deep-Dive Labs & Exercises",
        bullets: [
          `Build a resilient end-to-end prototype incorporating ${skill} with 80%+ test coverage.`,
          `Execute a fault-injection experiment (e.g. simulate network delays or crashed dependencies).`,
          `Conduct a peer code review emphasizing readability, algorithmic complexity, and security audit.`
        ]
      }
    ]
  };
}

/**
 * Downloads a structured PDF study note for a phase.
 */
export function downloadPhaseNotesPDF(milestone, profile = {}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const notes = getSkillStudyNotes(milestone.skill, profile);

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
      drawSubHeader();
    }
  };

  const drawSubHeader = () => {
    doc.setFillColor(79, 70, 229);
    doc.rect(margin, y, contentWidth, 2, "F");
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229);
    doc.text(`SKILLS MAP — STUDY NOTES: ${notes.skill.toUpperCase()}`, margin, y);
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  };

  // Main Header
  doc.setFillColor(79, 70, 229);
  doc.rect(margin, y, contentWidth, 3, "F");
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(`${notes.skill.toUpperCase()} — STUDY NOTES`, margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Official Academic & Industry Revision Guide  |  Target Role: ${notes.goal}`, margin, y);
  y += 9;

  // Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`STUDENT: ${profile?.name || "Student Learner"}`, margin + 6, y + 7);
  doc.text(`STATUS: ${milestone.status?.toUpperCase() || "IN PROGRESS"}`, margin + 6, y + 13);

  doc.text(`DATE: ${notes.date}`, margin + contentWidth / 2, y + 7);
  doc.text(`DURATION: ${milestone.durationWeeks || 2} Weeks Planned`, margin + contentWidth / 2, y + 13);

  y += 26;

  // Render Sections
  notes.sections.forEach((sec) => {
    checkPageBreak(30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(sec.heading, margin, y);
    y += 5.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    sec.bullets.forEach((b) => {
      const splitLines = doc.splitTextToSize(`* ${b}`, contentWidth - 4);
      checkPageBreak(splitLines.length * 4.5 + 2);
      doc.text(splitLines, margin + 4, y);
      y += splitLines.length * 4.5 + 2;
    });

    y += 4;
  });

  // Footer page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Skills Map Academic Notes  |  For Personal Learning & Interview Preparation", margin, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  }

  const safeName = milestone.skill.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`SkillsMap-StudyNotes-${safeName}.pdf`);
}

/**
 * Downloads notes in Markdown format for Notion/Obsidian or offline reading.
 */
export function downloadPhaseNotesMarkdown(milestone, profile = {}) {
  const notes = getSkillStudyNotes(milestone.skill, profile);

  let md = `# ${notes.title}\n\n`;
  md += `**Target Role:** ${notes.goal}  \n`;
  md += `**Student:** ${profile?.name || "Student Learner"}  \n`;
  md += `**Date:** ${notes.date}  \n`;
  md += `**Phase Status:** ${milestone.status?.toUpperCase() || "IN PROGRESS"} (${milestone.durationWeeks || 2} Weeks)  \n\n`;
  md += `---\n\n`;

  notes.sections.forEach((sec) => {
    md += `## ${sec.heading}\n\n`;
    sec.bullets.forEach((b) => {
      md += `- ${b}\n`;
    });
    md += `\n`;
  });

  md += `---\n*Generated by Skills Map Learning Platform*\n`;

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `SkillsMap-Notes-${milestone.skill.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads comprehensive all-phase notes combined into a single PDF.
 */
export function downloadAllCourseNotesPDF(milestones = [], profile = {}, goal = "") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
      drawSubHeader();
    }
  };

  const drawSubHeader = () => {
    doc.setFillColor(79, 70, 229);
    doc.rect(margin, y, contentWidth, 2, "F");
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229);
    doc.text("SKILLS MAP — MASTER CURRICULUM NOTES", margin, y);
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  };

  // Header Cover Banner
  doc.setFillColor(79, 70, 229);
  doc.rect(margin, y, contentWidth, 3, "F");
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text("MASTER CURRICULUM STUDY GUIDE", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Comprehensive Notes for all ${milestones.length} Phases  |  ${goal || "Career Trajectory"}`, margin, y);
  y += 9;

  // Meta card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`STUDENT: ${profile?.name || "Student"}`, margin + 6, y + 6.5);
  doc.text(`DATE: ${new Date().toLocaleDateString()}`, margin + 6, y + 12);
  doc.text(`TOTAL PHASES: ${milestones.length}`, margin + contentWidth / 2, y + 6.5);
  doc.text(`STATUS: ${milestones.filter(m => m.status === "complete").length} Completed`, margin + contentWidth / 2, y + 12);

  y += 24;

  milestones.forEach((m, idx) => {
    checkPageBreak(35);

    // Section title
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(67, 56, 202);
    doc.text(`PHASE ${idx + 1}: ${m.skill.toUpperCase()}`, margin + 5, y + 6);
    y += 14;

    const notes = getSkillStudyNotes(m.skill, profile);

    notes.sections.forEach((sec) => {
      checkPageBreak(25);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text(sec.heading, margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);

      sec.bullets.forEach((b) => {
        const splitLines = doc.splitTextToSize(`* ${b}`, contentWidth - 4);
        checkPageBreak(splitLines.length * 4 + 2);
        doc.text(splitLines, margin + 4, y);
        y += splitLines.length * 4 + 2;
      });

      y += 3;
    });

    y += 5;
  });

  // Footer page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Skills Map Master Study Guide  |  Personalized Academic Preparation", margin, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  }

  const safeGoal = (goal || "Curriculum").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`SkillsMap-MasterNotes-${safeGoal}.pdf`);
}
