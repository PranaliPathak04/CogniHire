export async function generatePDF(result, fileName, userEmail) {
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210,
    PL = 18,
    PR = 18,
    CW = W - PL - PR;
  let y = 0;

  const C = {
    bg: [8, 13, 24],
    accent: [56, 189, 248],
    purple: [99, 102, 241],
    green: [74, 222, 128],
    red: [248, 113, 113],
    white: [240, 242, 255],
    muted: [100, 116, 139],
    surface: [20, 30, 50],
    border: [30, 45, 70],
  };

  const newPage = () => {
    doc.addPage();
    doc.setFillColor(...C.bg);
    doc.rect(0, 0, W, 297, "F");
    y = 20;
  };
  const checkY = (n = 20) => {
    if (y + n > 275) newPage();
  };
  const txt = (str, x, yy, o = {}) => {
    doc.setTextColor(...(o.color || C.white));
    doc.setFontSize(o.size || 10);
    doc.setFont("helvetica", o.bold ? "bold" : "normal");
    o.align
      ? doc.text(str, x, yy, { align: o.align, maxWidth: o.maxWidth })
      : doc.text(str, x, yy, o.maxWidth ? { maxWidth: o.maxWidth } : undefined);
  };

  // ── Defensive normalizers ────────────────────────────────────────────
  // result.rewrites / result.interview_questions can arrive as either:
  //   - a raw string straight from a fresh /analyze call, OR
  //   - an already-split array (e.g. reloaded from History / localStorage)
  // These helpers make generatePDF work with either shape.
  const toRewriteBlocks = (rewrites) => {
    if (!rewrites) return [];
    if (Array.isArray(rewrites)) return rewrites;
    if (typeof rewrites === "string") {
      return rewrites.split(/\n(?=ORIGINAL:)/).filter(Boolean);
    }
    return [];
  };

  const toQuestionBlocks = (questions) => {
    if (!questions) return [];
    if (Array.isArray(questions)) return questions;
    if (typeof questions === "string") {
      return questions.split(/\n(?=\d+\.)/).filter(Boolean);
    }
    return [];
  };

  // Background
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(...C.accent);
  doc.rect(0, 0, W, 2, "F");
  doc.setFillColor(...C.surface);
  doc.rect(0, 0, W, 52, "F");
  doc.setFillColor(...C.border);
  doc.rect(0, 52, W, 0.4, "F");

  // Header
  doc.setFillColor(...C.accent);
  doc.circle(PL + 6, 18, 6, "F");
  doc.setFillColor(...C.purple);
  doc.circle(PL + 6, 18, 3.5, "F");
  txt("CogniHire", PL + 16, 16, { size: 16, bold: true });
  txt("AI Resume Analysis Report", PL + 16, 22, { size: 9, color: C.muted });
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  txt(date, W - PR, 16, { size: 9, color: C.muted, align: "right" });
  if (userEmail)
    txt(userEmail, W - PR, 22, { size: 9, color: C.muted, align: "right" });
  txt(fileName || "Resume", PL, 38, { size: 13, bold: true });
  txt("Analysed with Llama 3.3 · 70B via Groq", PL, 45, {
    size: 8,
    color: C.muted,
  });
  y = 64;

  // Scores
  const drawScore = (label, score, color, x, bw) => {
    doc.setFillColor(...C.surface);
    doc.roundedRect(x, y, bw, 28, 3, 3, "F");
    doc.setDrawColor(...color);
    doc.setLineWidth(1.8);
    doc.circle(x + 14, y + 14, 9, "S");
    doc.setTextColor(...color);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(String(Math.round(score)), x + 14, y + 17.5, { align: "center" });
    txt(label, x + 28, y + 10, { size: 8, color: C.muted });
    doc.setFillColor(...color);
    doc.rect(x + 28, y + 13, (bw - 32) * (score / 100), 3, "F");
    doc.setFillColor(...C.border);
    doc.rect(
      x + 28 + (bw - 32) * (score / 100),
      y + 13,
      (bw - 32) * (1 - score / 100),
      3,
      "F",
    );
    txt(`${Math.round(score)} / 100`, x + 28, y + 22, { size: 9, bold: true });
  };
  const bw = (CW - 8) / 3;
  drawScore("Overall ATS Score", result.score.ats_score, C.accent, PL, bw);
  drawScore(
    "Keyword Match",
    result.score.keyword_score,
    [34, 211, 238],
    PL + bw + 4,
    bw,
  );
  drawScore(
    "Semantic Match",
    result.score.semantic_score,
    [167, 139, 250],
    PL + bw * 2 + 8,
    bw,
  );
  y += 36;

  // Section header helper
  const section = (title, color) => {
    checkY(16);
    doc.setFillColor(...C.surface);
    doc.roundedRect(PL, y, CW, 10, 2, 2, "F");
    doc.setFillColor(...color);
    doc.rect(PL, y, 3, 10, "F");
    txt(title, PL + 8, y + 6.8, { size: 10, bold: true });
    y += 16;
  };

  // Skills
  section("Skill Analysis", C.green);
  const half = (CW - 6) / 2;
  const drawSkills = (skills, label, color, bgC, x) => {
    doc.setFillColor(...bgC);
    doc.roundedRect(x, y - 4, half, 10, 2, 2, "F");
    txt(`${label} (${skills.length})`, x + 4, y + 2.5, {
      size: 8,
      bold: true,
      color,
    });
    let bx = x,
      by = y + 10;
    skills.forEach((sk) => {
      const s = sk.replace(/_/g, " ");
      const tw = doc.getTextWidth(s) + 8;
      if (bx + tw > x + half) {
        bx = x;
        by += 8;
      }
      doc.setFillColor(...bgC);
      doc.roundedRect(bx, by - 4, tw, 7, 2, 2, "F");
      txt(s, bx + 4, by + 0.5, { size: 7.5, color });
      bx += tw + 4;
    });
    return by + 10;
  };
  const le = drawSkills(
    result.score.matched_skills,
    "Matched",
    C.green,
    [10, 30, 15],
    PL,
  );
  const re = drawSkills(
    result.score.missing_skills,
    "Skill Gaps",
    C.red,
    [30, 10, 10],
    PL + half + 6,
  );
  y = Math.max(le, re) + 6;

  // AI Feedback
  section("AI Recruiter Feedback", C.accent);
  doc
    .splitTextToSize((result.advice || "").replace(/\n+/g, " "), CW - 4)
    .forEach((line) => {
      checkY(7);
      txt(line, PL + 4, y, { size: 9, color: C.muted });
      y += 5.5;
    });
  y += 6;

  // Rewrites — now uses the defensive normalizer
  const rewrites = toRewriteBlocks(result.rewrites);
  if (rewrites.length) {
    section("Resume Rewrites", C.purple);
    rewrites.slice(0, 6).forEach((block) => {
      const lines = block.split("\n").filter(Boolean);
      const orig = lines
        .find((l) => l.startsWith("ORIGINAL:"))
        ?.replace("ORIGINAL:", "")
        .trim();
      const rew = lines
        .find((l) => l.startsWith("REWRITTEN:"))
        ?.replace("REWRITTEN:", "")
        .trim();
      if (!orig || !rew) return;
      checkY(24);
      doc.setFillColor(40, 20, 20);
      doc.roundedRect(PL, y, CW, 5, 1, 1, "F");
      txt("BEFORE", PL + 3, y + 3.5, { size: 6.5, bold: true, color: C.red });
      y += 6;
      doc
        .splitTextToSize(orig, CW - 6)
        .slice(0, 2)
        .forEach((l) => {
          checkY(6);
          txt(l, PL + 3, y, { size: 8.5, color: [200, 180, 180] });
          y += 5;
        });
      doc.setFillColor(15, 35, 20);
      doc.roundedRect(PL, y + 2, CW, 5, 1, 1, "F");
      txt("AFTER", PL + 3, y + 5.5, { size: 6.5, bold: true, color: C.green });
      y += 7;
      doc
        .splitTextToSize(rew, CW - 6)
        .slice(0, 2)
        .forEach((l) => {
          checkY(6);
          txt(l, PL + 3, y, { size: 8.5, color: [180, 220, 180] });
          y += 5;
        });
      y += 6;
    });
  }

  // Interview questions — now uses the defensive normalizer
  const qs = toQuestionBlocks(result.interview_questions);
  if (qs.length) {
    section("Interview Preparation", [34, 211, 238]);
    qs.slice(0, 10).forEach((q, i) => {
      const tip = q.match(/tip[:\s]+(.+)/i);
      const question = q
        .replace(/tip[:\s]+.+/i, "")
        .replace(/^\d+\.\s*/, "")
        .trim();
      const qLines = doc.splitTextToSize(question, CW - 14);
      const bh = qLines.length * 5 + (tip ? 8 : 2) + 6;
      checkY(bh + 4);
      doc.setFillColor(...C.surface);
      doc.roundedRect(PL, y, CW, bh, 2, 2, "F");
      doc.setFillColor(...[C.accent, [167, 139, 250], [34, 211, 238]][i % 3]);
      doc.circle(PL + 6, y + bh / 2, 4.5, "F");
      txt(String(i + 1).padStart(2, "0"), PL + 6, y + bh / 2 + 1.5, {
        size: 7,
        bold: true,
        color: [0, 0, 0],
        align: "center",
      });
      let qy = y + 6;
      qLines.forEach((l) => {
        txt(l, PL + 14, qy, { size: 9 });
        qy += 5;
      });
      if (tip)
        txt("Tip: " + tip[1], PL + 14, qy + 2, {
          size: 8,
          color: C.accent,
          maxWidth: CW - 16,
        });
      y += bh + 4;
    });
  }

  // Footer
  for (let p = 1; p <= doc.getNumberOfPages(); p++) {
    doc.setPage(p);
    doc.setFillColor(...C.border);
    doc.rect(0, 285, W, 0.4, "F");
    txt("Generated by CogniHire · Powered by Llama 3.3 70B", W / 2, 291, {
      size: 7.5,
      color: C.muted,
      align: "center",
    });
    txt(`Page ${p} of ${doc.getNumberOfPages()}`, W - PR, 291, {
      size: 7.5,
      color: C.muted,
      align: "right",
    });
  }
  doc.save(`CogniHire_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
