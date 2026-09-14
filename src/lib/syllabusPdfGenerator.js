import { jsPDF } from "jspdf";

/**
 * Generates an official, beautifully structured academic syllabus PDF
 * for the student's personalized learning roadmap.
 */
export function generateSyllabusPDF(profile, milestones = [], goal = "") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
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
      drawHeaderBanner(true);
    }
  };

  const drawHeaderBanner = (isContinued = false) => {
    // Top subtle bar
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(margin, y, contentWidth, 3, "F");
    y += 8;

    if (isContinued) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(79, 70, 229);
      doc.text("SKILLS MAP — LEARNING SYLLABUS (CONTINUED)", margin, y);
      y += 6;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, margin + contentWidth, y);
      y += 8;
      return;
    }

    // Title Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text("ACADEMIC & CAREER SYLLABUS", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(
      "Personalized Competency Roadmap, Phase Objectives & Assessment Standards",
      margin,
      y
    );
    y += 9;

    // Metadata card
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.roundedRect(margin, y, contentWidth, 30, 2, 2, "FD");

    const col1 = margin + 5;
    const col2 = margin + contentWidth / 2 + 5;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("STUDENT NAME:", col1, y + 8);
    doc.text("TARGET CAREER ROLE:", col2, y + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(profile?.name || "Student Learner", col1, y + 14);
    doc.text(goal || profile?.careerGoal || profile?.track || "Software Engineer", col2, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("GENERATION DATE:", col1, y + 22);
    doc.text("CURRICULUM DURATION:", col2, y + 22);

    const totalWeeks = milestones.reduce((acc, m) => acc + (m.durationWeeks || 2), 0);
    const completedPhases = milestones.filter((m) => m.status === "complete").length;
    const pct = milestones.length ? Math.round((completedPhases / milestones.length) * 100) : 0;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229);
    doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), col1, y + 27);
    doc.text(`${totalWeeks} Total Weeks (${milestones.length} Phases · ${pct}% Completed)`, col2, y + 27);

    y += 38;
  };

  // First page header
  drawHeaderBanner(false);

  // Progress summary block
  const completedPhases = milestones.filter((m) => m.status === "complete").length;
  const progressPercent = milestones.length ? Math.round((completedPhases / milestones.length) * 100) : 0;

  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(67, 56, 202);
  doc.text(
    `CURRICULUM PROGRESS: ${completedPhases} of ${milestones.length} Phases Completed (${progressPercent}%)`,
    margin + 6,
    y + 7.5
  );

  y += 18;

  // Overview Introduction
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("1. CURRICULUM ARCHITECTURE & METHODOLOGY", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const introText =
    "This syllabus establishes a milestone-based competency trajectory designed by Skills Map AI. Each sequential phase requires the mastery of core industry proficiencies, completion of technical objectives, and verification through a phase assessment quiz before progressing.";
  const splitIntro = doc.splitTextToSize(introText, contentWidth);
  doc.text(splitIntro, margin, y);
  y += splitIntro.length * 4.8 + 6;

  // Section 2: Phase Breakdown
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("2. PHASE-BY-PHASE SYLLABUS & EVALUATION CRITERIA", margin, y);
  y += 8;

  milestones.forEach((m, idx) => {
    // Estimate height of this phase box
    const subGoalsCount = m.subGoals?.length || 2;
    const boxHeight = 44 + subGoalsCount * 5;

    checkPageBreak(boxHeight);

    const isComplete = m.status === "complete";
    const isInProgress = m.status === "in_progress";

    // Phase Box Container
    if (isComplete) {
      doc.setFillColor(240, 253, 244); // Green 50
      doc.setDrawColor(187, 247, 208); // Green 200
    } else if (isInProgress) {
      doc.setFillColor(245, 243, 255); // Violet 50
      doc.setDrawColor(196, 181, 253); // Violet 300
    } else {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240); // Slate 200
    }

    doc.roundedRect(margin, y, contentWidth, boxHeight - 4, 2, 2, "FD");

    // Phase title & badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`PHASE ${idx + 1}: ${m.skill.toUpperCase()}`, margin + 6, y + 8);

    // Status pill text
    const statusText = isComplete ? "COMPLETED" : isInProgress ? "IN PROGRESS" : "LOCKED";
    doc.setFontSize(8.5);
    if (isComplete) {
      doc.setTextColor(21, 128, 61); // Green 700
    } else if (isInProgress) {
      doc.setTextColor(109, 40, 217); // Violet 700
    } else {
      doc.setTextColor(100, 116, 139); // Slate 500
    }
    doc.text(`[ ${statusText} ]`, margin + contentWidth - 32, y + 8);

    // Timeline & Proficiency Target
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const baseline = Math.round((m.currentLevel || 0.3) * 100);
    const target = Math.round((m.targetLevel || 0.8) * 100);
    doc.text(
      `Duration: ${m.durationWeeks || 2} Weeks  |  Baseline: ${baseline}%  ->  Target Proficiency: ${target}%`,
      margin + 6,
      y + 15
    );

    // Divider inside box
    doc.setDrawColor(226, 232, 240);
    doc.line(margin + 6, y + 18, margin + contentWidth - 6, y + 18);

    // Core Objectives Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text("Core Syllabus Objectives & Deliverables:", margin + 6, y + 24);

    let objY = y + 29;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    const goals = m.subGoals && m.subGoals.length > 0 
      ? m.subGoals 
      : [
          `Master core architectural patterns and fundamentals of ${m.skill}`,
          `Implement production-ready projects and verify via comprehensive testing`,
          `Pass Phase Assessment Quiz with >= 66% score to advance`
        ];

    goals.forEach((g) => {
      doc.text(`*  ${g}`, margin + 8, objY);
      objY += 5;
    });

    // Evaluation rule footer inside box
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Evaluation: Phase completion requires passing the adaptive competency assessment quiz.`,
      margin + 6,
      objY + 3
    );

    y += boxHeight;
  });

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      "Skills Map Academic Platform  |  Official Syllabus & Curriculum Trajectory",
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  }

  // Save PDF
  const sanitizedGoal = (goal || "Curriculum").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`SkillsMap-Syllabus-${sanitizedGoal}.pdf`);
}
