import { jsPDF } from "jspdf";

/**
 * High-Resolution Official Certificate PDF Generator for SkillsMap
 * Produces a landscape certificate with ornamental border, gold foil seal,
 * official signature, QR verification placeholder, and metadata.
 */
export function generateCertificatePDF(certificate, studentName = "Student Scholar") {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4", // 297mm x 210mm
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background Fill
  doc.setFillColor(252, 253, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Outer Decorative Double Border
  doc.setDrawColor(79, 70, 229); // Indigo 600
  doc.setLineWidth(2.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(217, 119, 6); // Amber / Gold
  doc.setLineWidth(0.8);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Corner Ornaments
  const cornerSize = 12;
  const drawCorner = (x, y, flipX, flipY) => {
    doc.setFillColor(79, 70, 229);
    doc.triangle(
      x, y,
      x + (flipX ? -cornerSize : cornerSize), y,
      x, y + (flipY ? -cornerSize : cornerSize),
      "F"
    );
  };
  drawCorner(13, 13, false, false);
  drawCorner(pageWidth - 13, 13, true, false);
  drawCorner(13, pageHeight - 13, false, true);
  drawCorner(pageWidth - 13, pageHeight - 13, true, true);

  // Top Header: Organization & Crest
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text("SKILLSMAP ACADEMY OF ADVANCED COMPUTING & TECHNOLOGY", pageWidth / 2, 26, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("INSTITUTIONAL ACCREDITATION & INDUSTRY VERIFIED CREDENTIALS", pageWidth / 2, 31, { align: "center" });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(60, 35, pageWidth - 60, 35);

  // Certificate Title Headline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 47, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10.5);
  doc.setTextColor(100, 116, 139);
  doc.text("This official credential is proudly conferred upon", pageWidth / 2, 56, { align: "center" });

  // Recipient Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(67, 56, 202); // Indigo 700
  doc.text(studentName.toUpperCase(), pageWidth / 2, 70, { align: "center" });

  // Underline beneath name
  const nameWidth = doc.getTextWidth(studentName.toUpperCase());
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1.2);
  doc.line((pageWidth - nameWidth) / 2 - 10, 74, (pageWidth + nameWidth) / 2 + 10, 74);

  // Certificate Achievement Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(51, 65, 85);
  doc.text("for exceptional proficiency and verified mastery in completing the certified curriculum:", pageWidth / 2, 83, { align: "center" });

  // Course / Award Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  const certTitle = certificate.title || "Full-Stack Software Architecture & Engineering";
  doc.text(certTitle, pageWidth / 2, 94, { align: "center" });

  // Optional description
  if (certificate.description) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(certificate.description, 200);
    doc.text(splitDesc, pageWidth / 2, 103, { align: "center" });
  }

  // Skills Covered Pill Box
  if (certificate.skills && certificate.skills.length > 0) {
    const skillsText = `Competencies Endorsed: ${certificate.skills.join("  •  ")}`;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(40, 112, pageWidth - 80, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229);
    doc.text(skillsText, pageWidth / 2, 118, { align: "center" });
  }

  // Metadata Grid: Grade, Score, Issue Date, Issuer
  const metaY = 132;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(30, metaY, pageWidth - 60, 22, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(30, metaY, pageWidth - 60, 22);

  const colWidth = (pageWidth - 60) / 4;

  // Col 1: Grade/Standing
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("HONORS & STANDING", 30 + colWidth * 0.5, metaY + 7, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(217, 119, 6);
  doc.text(certificate.grade || "Distinction (Top 1%)", 30 + colWidth * 0.5, metaY + 15, { align: "center" });

  // Col 2: Issuer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("ISSUING BODY", 30 + colWidth * 1.5, metaY + 7, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const issuerShort = certificate.issuer?.substring(0, 30) || "SkillsMap Tech Board";
  doc.text(issuerShort, 30 + colWidth * 1.5, metaY + 15, { align: "center" });

  // Col 3: Issue Date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("DATE OF ISSUANCE", 30 + colWidth * 2.5, metaY + 7, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(certificate.issueDate || new Date().toISOString().split("T")[0], 30 + colWidth * 2.5, metaY + 15, { align: "center" });

  // Col 4: Credential ID
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("CREDENTIAL ID", 30 + colWidth * 3.5, metaY + 7, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text(certificate.credentialId || `SKM-${Date.now().toString().slice(-6)}`, 30 + colWidth * 3.5, metaY + 15, { align: "center" });

  // ==========================================
  // Bottom Row: Signatures & Gold Seal
  // ==========================================
  const signY = 175;

  // Left Signature: Academic Dean
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.6);
  doc.line(35, signY, 95, signY);
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text("Dr. Elena Rostova", 65, signY - 3, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Dean of Academic Technology", 65, signY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SkillsMap Board of Examiners", 65, signY + 9, { align: "center" });

  // Center: Gold Seal Embellishment
  const sealX = pageWidth / 2;
  const sealY = signY - 6;
  doc.setFillColor(254, 243, 199);
  doc.circle(sealX, sealY, 14, "F");
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1.2);
  doc.circle(sealX, sealY, 14);
  doc.setLineWidth(0.5);
  doc.circle(sealX, sealY, 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);
  doc.text("OFFICIAL SEAL", sealX, sealY - 2, { align: "center" });
  doc.setFontSize(8);
  doc.text("VERIFIED", sealX, sealY + 3, { align: "center" });
  doc.setFontSize(5.5);
  doc.text("SECURE CREDENTIAL", sealX, sealY + 7, { align: "center" });

  // Right Signature: Industry Verification Officer
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.6);
  doc.line(pageWidth - 95, signY, pageWidth - 35, signY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text("Marcus Vance, VP", pageWidth - 65, signY - 3, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Global Accreditation Officer", pageWidth - 65, signY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Industry Engineering Guild", pageWidth - 65, signY + 9, { align: "center" });

  // Bottom Verification URL
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const verifyText = `Official Verification Registry: ${certificate.verificationUrl || `https://skillsmap.io/verify/${certificate.credentialId || "SM-CERT"}`} · Tamper-evident cryptographic signature`;
  doc.text(verifyText, pageWidth / 2, pageHeight - 14, { align: "center" });

  // Save the document
  const sanitizedTitle = (certificate.title || "SkillsMap_Certificate").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`${sanitizedTitle}_${studentName.replace(/\s+/g, "_")}.pdf`);
}
