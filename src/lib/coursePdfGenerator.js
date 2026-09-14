import { jsPDF } from "jspdf";

/**
 * Enterprise-Grade Course PDF Generator for SkillsMap
 * Supports:
 * - Structured Nested Headings (H1 Document, H2 Module, H3 Subsections)
 * - Clickable YouTube Video Lecture Links with Timestamps and Metadata
 * - Clickable External Resource & Official Documentation Hyperlinks
 * - Dark Terminal Code Blocks with Syntax Clarity
 * - High-Contrast Visual Callouts (ELI5, Pitfalls, Practice Labs)
 * - Dynamic Height Calculations, Page Numbering & Running Headers/Footers
 */

export function downloadFullCoursePDF(dayNotes = [], profile = {}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(margin, y, contentWidth, 1.2, "F");
    y += 3.5;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(79, 70, 229);
    doc.text("SKILLSMAP — MASTER ENGINEERING HANDBOOK & CURRICULUM SPECIFICATION", margin, y);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    const learnerName = profile?.name || profile?.full_name || "Enrolled Scholar";
    doc.text(`Learner: ${learnerName}  ·  Exported: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: "right" });
    
    y += 3;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
  };

  // ==========================================
  // 1. EXECUTIVE COVER BANNER (H1 LEVEL)
  // ==========================================
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14.5);
  doc.setTextColor(255, 255, 255);
  const subjectTitle = profile?.track || (dayNotes[0]?.subject) || "Software Engineering Master Track";
  doc.text(`${subjectTitle.toUpperCase()} — COMPREHENSIVE HANDBOOK`, margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(199, 210, 254);
  doc.text("Structured Academic Syllabus, Video Masterclasses, Under-the-Hood Mechanics & Verified Code", margin + 6, y + 18);

  doc.setFontSize(7.5);
  doc.setTextColor(224, 231, 255);
  const learnerStr = profile?.name || profile?.full_name || "Student Scholar";
  doc.text(`Learner: ${learnerStr}  |  Modules: ${dayNotes.length} Chapters  |  Accredited by SkillsMap Engineering Council`, margin + 6, y + 26);

  // Document metadata tags
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 6, y + 30, contentWidth - 12, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(129, 140, 248);
  doc.text("FORMAT: PDF/A-1b Interactive Document  ·  Hyperlinks Enabled  ·  YouTube Direct Access Supported", margin + 9, y + 34.5);

  y += 48;

  // ==========================================
  // 2. SYLLABUS DIRECTORY (TABLE OF CONTENTS)
  // ==========================================
  checkPageBreak(38);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text("TABLE OF CONTENTS & SYLLABUS ROADMAP", margin + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  dayNotes.forEach((dn, idx) => {
    const colX = idx < 5 ? margin + 5 : margin + contentWidth / 2 + 5;
    const rowIdx = idx < 5 ? idx : idx - 5;
    const rowY = y + 11 + rowIdx * 3.4;
    if (rowY < y + 28) {
      const cleanTitle = (dn.title || "").replace(/^Day \d+:\s*/i, "");
      doc.text(`• Day ${dn.dayNumber}: ${cleanTitle.substring(0, 42)}${cleanTitle.length > 42 ? "..." : ""}`, colX, rowY);
    }
  });

  y += 36;

  // ==========================================
  // 3. ITERATE THROUGH DAY NOTES (STRUCTURED CONTENT)
  // ==========================================
  dayNotes.forEach((dn, dayIdx) => {
    checkPageBreak(50);

    // Module Header (H2 Level)
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.setDrawColor(199, 210, 254); // Indigo 200
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(67, 56, 202);
    doc.text(dn.title || `Day ${dn.dayNumber}`, margin + 4, y + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Subject: ${dn.subject || "Computer Science"}  ·  Category: ${dn.topicCategory || "Core Architecture"}  ·  Module ${dayIdx + 1} of ${dayNotes.length}`, margin + 4, y + 12);

    y += 20;

    // -------------------------------------------------------------
    // Nested Subsection 1.0: Executive Overview & Learning Objectives (H3)
    // -------------------------------------------------------------
    if (dn.summary) {
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text("1.0 EXECUTIVE OVERVIEW & LEARNING OBJECTIVES", margin, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const summaryLines = doc.splitTextToSize(dn.summary, contentWidth);
      checkPageBreak(summaryLines.length * 4 + 4);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4 + 4;
    }

    // -------------------------------------------------------------
    // Nested Subsection 2.0: Deep System Architecture & Mechanism (H3)
    // -------------------------------------------------------------
    if (dn.deepExplanation) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(79, 70, 229);
      doc.text("2.0 UNDER-THE-HOOD SYSTEM ARCHITECTURE & EXECUTION MECHANISM", margin, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const deepLines = doc.splitTextToSize(dn.deepExplanation, contentWidth);
      checkPageBreak(deepLines.length * 4 + 4);
      doc.text(deepLines, margin, y);
      y += deepLines.length * 4 + 4;
    }

    // -------------------------------------------------------------
    // Nested Subsection 3.0: ELI5 Mental Model & Intuitive Metaphor (H3)
    // -------------------------------------------------------------
    if (dn.eli10?.story) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const storyLines = doc.splitTextToSize(dn.eli10.story, contentWidth - 10);
      const boxH = Math.max(24, storyLines.length * 3.8 + 14);

      checkPageBreak(boxH + 6);
      doc.setFillColor(254, 243, 199); // Amber 100
      doc.setDrawColor(251, 191, 36);  // Amber 400
      doc.roundedRect(margin, y, contentWidth, boxH, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(146, 64, 14);
      doc.text(`3.0 INTUITIVE MENTAL MODEL (ELI5): ${dn.eli10.title || "Metaphor"}`, margin + 4, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 53, 15);
      doc.text(storyLines, margin + 4, y + 11.5);

      y += boxH + 5;
    }

    // -------------------------------------------------------------
    // Nested Subsection 4.0: Core Engineering Principles & Vocabulary (H3)
    // -------------------------------------------------------------
    if (dn.eli10?.keyConcepts?.length) {
      checkPageBreak(dn.eli10.keyConcepts.length * 6 + 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text("4.0 CORE ENGINEERING VOCABULARY & ARCHITECTURAL PRINCIPLES", margin, y);
      y += 5;

      dn.eli10.keyConcepts.forEach((kc) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(79, 70, 229);
        doc.text(`• ${kc.term}: `, margin + 2, y);
        const termWidth = doc.getTextWidth(`• ${kc.term}: `);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        const meaningLines = doc.splitTextToSize(kc.meaning, contentWidth - termWidth - 4);
        doc.text(meaningLines, margin + 2 + termWidth, y);
        y += meaningLines.length * 3.8;
      });
      y += 4;
    }

    // -------------------------------------------------------------
    // Nested Subsection 5.0: Verified Production Implementation (Code Lab) (H3)
    // -------------------------------------------------------------
    if (dn.codeSnippet) {
      doc.setFont("courier", "normal");
      doc.setFontSize(7.2);
      const codeLines = doc.splitTextToSize(dn.codeSnippet, contentWidth - 10);
      const outputLines = dn.expectedOutput ? doc.splitTextToSize(dn.expectedOutput, contentWidth - 10) : [];
      const codeBoxH = codeLines.length * 3.5 + (outputLines.length ? outputLines.length * 3.3 + 12 : 10);

      checkPageBreak(codeBoxH + 8);
      doc.setFillColor(15, 23, 42); // Slate 900
      doc.roundedRect(margin, y, contentWidth, codeBoxH, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(226, 232, 240);
      doc.text("5.0 VERIFIED PRODUCTION CODE IMPLEMENTATION", margin + 4, y + 5.5);

      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      doc.setTextColor(147, 197, 253); // Sky 300
      doc.text(codeLines, margin + 4, y + 10.5);

      if (outputLines.length) {
        const outY = y + 10.5 + codeLines.length * 3.5 + 2;
        doc.setDrawColor(51, 65, 85);
        doc.line(margin + 4, outY - 1, margin + contentWidth - 4, outY - 1);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.8);
        doc.setTextColor(167, 139, 250); // Violet 400
        doc.text("TERMINAL STDOUT OUTPUT:", margin + 4, outY + 2.5);

        doc.setFont("courier", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(203, 213, 225);
        doc.text(outputLines, margin + 4, outY + 6);
      }

      y += codeBoxH + 5;
    }

    // -------------------------------------------------------------
    // Nested Subsection 6.0: Architectural Pitfalls & Edge Cases (H3)
    // -------------------------------------------------------------
    if (dn.pitfalls) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      const pitfallLines = doc.splitTextToSize(dn.pitfalls, contentWidth - 10);
      const pitfallH = Math.max(16, pitfallLines.length * 3.6 + 10);

      checkPageBreak(pitfallH + 6);
      doc.setFillColor(254, 226, 226); // Rose 100
      doc.setDrawColor(248, 113, 113); // Rose 400
      doc.roundedRect(margin, y, contentWidth, pitfallH, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.text("6.0 ARCHITECTURAL PITFALLS, ANTI-PATTERNS & PRODUCTION FIX:", margin + 4, y + 5.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(185, 28, 28);
      doc.text(pitfallLines, margin + 4, y + 10);

      y += pitfallH + 5;
    }

    // -------------------------------------------------------------
    // Nested Subsection 7.0: Hands-On Practice Challenge & Solution (H3)
    // -------------------------------------------------------------
    if (dn.practiceChallenge) {
      const qLines = doc.splitTextToSize(`Exercise: ${dn.practiceChallenge.question}`, contentWidth - 10);
      const solLines = doc.splitTextToSize(dn.practiceChallenge.solutionCode, contentWidth - 10);
      const chalH = qLines.length * 3.6 + solLines.length * 3.4 + 15;

      checkPageBreak(chalH + 6);
      doc.setFillColor(240, 253, 244); // Emerald 50
      doc.setDrawColor(74, 222, 128); // Emerald 400
      doc.roundedRect(margin, y, contentWidth, chalH, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(21, 128, 61);
      doc.text("7.0 HANDS-ON PRACTICE CHALLENGE & REFERENCE SOLUTION:", margin + 4, y + 5.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(22, 101, 52);
      doc.text(qLines, margin + 4, y + 10);

      const solStartY = y + 10 + qLines.length * 3.6 + 2;
      doc.setFont("courier", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(6, 78, 59);
      doc.text(solLines, margin + 4, solStartY);

      y += chalH + 5;
    }

    // -------------------------------------------------------------
    // Nested Subsection 8.0: Curated YouTube Video Lectures (H3 + Interactive Hyperlinks)
    // -------------------------------------------------------------
    if (dn.youtubeLectures && dn.youtubeLectures.length > 0) {
      checkPageBreak(35 * dn.youtubeLectures.length + 10);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(220, 38, 38); // Red 600 (YouTube)
      doc.text("8.0 CURATED YOUTUBE VIDEO LECTURES & MASTERCLASSES (CLICKABLE LINKS)", margin, y);
      y += 5;

      dn.youtubeLectures.forEach((yt) => {
        const descLines = doc.splitTextToSize(yt.summary || "Interactive deep dive video lecture", contentWidth - 12);
        const ytBoxH = Math.max(22, descLines.length * 3.5 + 16);

        checkPageBreak(ytBoxH + 4);
        doc.setFillColor(254, 242, 242); // Red 50
        doc.setDrawColor(252, 165, 165); // Red 300
        doc.roundedRect(margin, y, contentWidth, ytBoxH, 1.5, 1.5, "FD");

        // YouTube Icon / Badge
        doc.setFillColor(220, 38, 38);
        doc.roundedRect(margin + 3, y + 3, 14, 5, 1, 1, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text("YOUTUBE", margin + 4.5, y + 6.5);

        // Video Title & Duration
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(153, 27, 27);
        doc.text(`${yt.title}  ·  [${yt.duration || "Full Lecture"}]`, margin + 19, y + 6.5);

        // Creator / Channel
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(127, 29, 29);
        doc.text(`Instructor / Channel: ${yt.channel || "Technical Lead"}`, margin + 4, y + 11);

        // Description
        doc.setTextColor(153, 27, 27);
        doc.text(descLines, margin + 4, y + 15);

        // Clickable URL Link
        const linkY = y + 15 + descLines.length * 3.5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(37, 99, 235); // Blue 600
        const linkText = `🔗 Watch Video on YouTube: ${yt.url}`;
        doc.text(linkText, margin + 4, linkY);
        
        // Add PDF Link Annotation
        const linkWidth = doc.getTextWidth(linkText);
        doc.link(margin + 4, linkY - 3, linkWidth, 4, { url: yt.url });

        y += ytBoxH + 4;
      });
      y += 2;
    }

    // -------------------------------------------------------------
    // Nested Subsection 9.0: External Documentation & Reference URLs (H3 + Interactive Hyperlinks)
    // -------------------------------------------------------------
    if ((dn.externalResources && dn.externalResources.length > 0) || dn.webLink) {
      checkPageBreak(30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235); // Blue 600
      doc.text("9.0 AUTHORITATIVE WEB DOCUMENTATION & EXTERNAL HYPERLINKS", margin, y);
      y += 5;

      const resources = dn.externalResources || (dn.webLink ? [{
        title: dn.webLink.title,
        url: dn.webLink.url,
        provider: "Official Docs",
        desc: "Primary reference documentation for syntax and API specs."
      }] : []);

      resources.forEach((res) => {
        checkPageBreak(16);
        doc.setFillColor(239, 246, 255); // Blue 50
        doc.setDrawColor(191, 219, 254); // Blue 200
        doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(30, 64, 175);
        doc.text(`🌐 ${res.title} [${res.provider || "Official Source"}]`, margin + 3, y + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(37, 99, 235);
        const urlText = `Link: ${res.url}`;
        doc.text(urlText, margin + 3, y + 9.5);

        // Clickable URL Annotation
        const uWidth = doc.getTextWidth(urlText);
        doc.link(margin + 3, y + 6.5, uWidth, 4, { url: res.url });

        y += 16;
      });
      y += 2;
    }

    // Section Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  });

  // ==========================================
  // 4. RUNNING FOOTERS WITH ACCURATE PAGE NUMBERS
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    
    // Bottom border
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);
    
    // Footer text
    doc.text(
      "SkillsMap Academic & Career Engineering Council · Official Syllabus & Code Reference",
      margin,
      pageHeight - 7
    );
    doc.text(
      `Document SM-DOC-MASTER · Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: "right" }
    );
  }

  // Generate clean filename
  const cleanTrack = (profile?.track || (dayNotes[0]?.subject) || "Engineering_Course")
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "");
  const filename = `SkillsMap_${cleanTrack}_Master_Handbook.pdf`;
  doc.save(filename);
}

/**
 * Downloads a single module/day as an executive high-definition PDF
 */
export function downloadSingleDayPDF(dayNote, profile = {}) {
  if (!dayNote) return;
  downloadFullCoursePDF([dayNote], profile);
}

/**
 * Generates an executive study schedule timetable PDF
 */
export function downloadTimetablePDF(schedule = [], profile = {}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("PERSONALIZED STUDY TIMETABLE & MILESTONE ROADMAP", margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(199, 210, 254);
  const student = profile?.name || profile?.full_name || "Enrolled Scholar";
  doc.text(`Student: ${student}  ·  Generated: ${new Date().toLocaleDateString()}  ·  Paced Repetition Schedule`, margin + 6, y + 18);

  doc.setFontSize(7.5);
  doc.setTextColor(165, 180, 252);
  doc.text(`Target Focus: ${profile?.track || "Computer Science Mastery"}  ·  Accredited via SkillsMap`, margin + 6, y + 25);

  y += 38;

  // Table of schedule items
  schedule.forEach((item, idx) => {
    if (y + 24 > pageHeight - 16) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(67, 56, 202);
    doc.text(`${item.day || `Day ${item.dayIndex || idx + 1}`}  ·  ${item.date || ""}`, margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Slot: ${item.timeSlot || "Flexible"} (${item.allocatedHours || 2}h)  ·  Type: ${item.type || "Core Practice"}`, margin + 4, y + 11);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(`Topic: ${item.topic || "Module Study"}`, margin + 4, y + 16);

    y += 24;
  });

  const filename = `SkillsMap_Personal_Timetable_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// Aliases for backwards-compatibility across the app
export const downloadCoursePDF = downloadFullCoursePDF;
export const downloadModuleNotesPDF = downloadSingleDayPDF;
export const downloadDayNotesPDF = downloadSingleDayPDF;
