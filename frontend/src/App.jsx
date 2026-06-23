import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { Icon, Icons } from "./constants/icons.jsx";
import { generatePDF } from "./utils/generatePDF.js";
import ScoreRing from "./components/ScoreRing.jsx";
import SkillBadge from "./components/SkillBadge.jsx";
import RewriteCard from "./components/RewriteCard.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import NavItem from "./components/NavItem.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import JobModal from "./components/JobModal.jsx";

const API = "http://localhost:8000";

// ── Icons ──────────────────────────────────────────────────────────────────

// ── Score Ring ─────────────────────────────────────────────────────────────

// ── Skill Badge ────────────────────────────────────────────────────────────

// ── Rewrite Card ──────────────────────────────────────────────────────────

// ── Question Card ─────────────────────────────────────────────────────────

// ── Sidebar Nav Item ──────────────────────────────────────────────────────

// ── Upload Page ───────────────────────────────────────────────────────────

//--Job Modal Component────────────────────────────────────────────────────────

// ── Main App ──────────────────────────────────────────────────────────────
export default function App({ user, onSignOut }) {
  const [dark, setDark] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [jobsResult, setJobsResult] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("India");
  const [currentFile, setCurrentFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ch_history") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedJob, setSelectedJob] = useState(null);

  const handleAnalyze = async (file, jdText, jdUrl, jdMode) => {
    if (!file) return setError("Please upload a resume PDF.");
    if (jdMode === "text" && !jdText.trim())
      return setError("Please enter a job description.");
    if (jdMode === "url" && !jdUrl.trim())
      return setError("Please enter a job URL.");
    setError(null);
    setLoading(true);
    setResult(null);
    setCurrentFile(file);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      if (jdMode === "text") fd.append("jd_text", jdText);
      else fd.append("jd_url", jdUrl);
      const { data } = await axios.post(`${API}/analyze`, fd);
      setResult(data);
      setActivePage("dashboard");

      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        fileName: file?.name || "Resume",
        ats: Math.round(data.score.ats_score),
        keyword: Math.round(data.score.keyword_score),
        semantic: Math.round(data.score.semantic_score),
      };
      setScoreHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 10);
        localStorage.setItem("ch_history", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      setError(
        e.response?.data?.detail ||
          "Something went wrong. Is the backend running?",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJobSearch = async (file) => {
    if (!file) return setError("Please upload a resume first.");
    setJobsLoading(true);
    setError(null);
    setCurrentFile(file);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      fd.append("location", location);
      const { data } = await axios.post(`${API}/jobs`, fd);
      setJobsResult(data);
      setActivePage("jobs");
    } catch (e) {
      setError("Job search failed. Is the backend running?");
    } finally {
      setJobsLoading(false);
    }
  };

  const refreshJobs = async () => {
    if (!currentFile) return;
    setJobsLoading(true);
    try {
      const fd = new FormData();
      fd.append("resume", currentFile);
      fd.append("location", location);
      const { data } = await axios.post(`${API}/jobs`, fd);
      setJobsResult(data);
    } catch (e) {
      setError("Job search failed.");
    } finally {
      setJobsLoading(false);
    }
  };

  const questions = result?.interview_questions
    ? result.interview_questions.split(/\n(?=\d+\.)/).filter(Boolean)
    : [];
  const rewrites = result?.rewrites
    ? result.rewrites.split(/\n(?=ORIGINAL:)/).filter(Boolean)
    : [];

  const hasResult = !!result;

  const sidebarPages = [
    { id: "home", icon: Icons.upload, label: "Analyse" },
    {
      id: "dashboard",
      icon: Icons.dashboard,
      label: "Dashboard",
      locked: !hasResult,
    },
    {
      id: "skills",
      icon: Icons.check,
      label: "Skills",
      locked: !hasResult,
      badge:
        result?.score?.missing_skills?.length > 0
          ? result.score.missing_skills.length
          : null,
    },
    {
      id: "rewrites",
      icon: Icons.edit,
      label: "Rewrites",
      locked: !hasResult,
      badge: rewrites.length || null,
    },
    {
      id: "interview",
      icon: Icons.brain,
      label: "Interview",
      locked: !hasResult,
      badge: questions.length || null,
    },
    {
      id: "jobs",
      icon: Icons.search,
      label: "Jobs",
      badge: jobsResult?.jobs?.length || null,
    },

    {
      id: "history",
      icon: Icons.history,
      label: "History",
      badge: scoreHistory.length || null,
    },
  ];

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Top Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand-icon">
              <Icon d={Icons.zap} size={18} fill="currentColor" stroke="none" />
            </div>
            <span className="brand-name">CogniHire</span>
            <span className="brand-tag">AI</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {user?.email}
            </span>
            <button
              className="theme-toggle"
              onClick={onSignOut}
              title="Sign out"
            >
              <Icon d={Icons.signout} size={18} />
            </button>
            <button className="theme-toggle" onClick={() => setDark(!dark)}>
              <Icon d={dark ? Icons.sun : Icons.moon} size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* App Shell */}
      <div className="app-shell">
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-inner">
            {sidebarPages.map(({ id, icon, label, locked, badge }) => (
              <button
                key={id}
                className={`sidebar-item ${activePage === id ? "sidebar-item--active" : ""} ${locked ? "sidebar-item--locked" : ""}`}
                onClick={() => !locked && setActivePage(id)}
                title={locked ? "Run an analysis first" : label}
              >
                <span className="sidebar-icon">
                  <Icon d={icon} size={18} />
                </span>
                <span className="sidebar-label">{label}</span>
                {badge != null && (
                  <span className="sidebar-badge">{badge}</span>
                )}
                {locked && <span className="sidebar-lock">🔒</span>}
              </button>
            ))}
          </div>

          {/* Re-analyse button at bottom of sidebar */}
          {hasResult && (
            <button
              className="reanalyse-btn"
              onClick={() => setActivePage("home")}
            >
              <Icon d={Icons.refresh} size={15} />
              <span>Re-analyse</span>
            </button>
          )}
        </aside>

        {/* Main Content */}
        <main className="content">
          {/* HOME — Upload Page */}
          {activePage === "home" && (
            <UploadPage
              onAnalyze={handleAnalyze}
              onJobSearch={handleJobSearch}
              loading={loading}
              jobsLoading={jobsLoading}
              error={error}
            />
          )}

          {/* DASHBOARD */}
          {activePage === "dashboard" && result && (
            <div className="page-content animate-in">
              <div
                className="page-header"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h2 className="page-title">Dashboard</h2>
                  <p className="page-sub">Your resume analysis results</p>
                </div>
                <button
                  className="jobs-refresh-btn"
                  disabled={pdfLoading}
                  onClick={async () => {
                    setPdfLoading(true);
                    try {
                      await generatePDF(result, currentFile?.name, user?.email);
                    } finally {
                      setPdfLoading(false);
                    }
                  }}
                >
                  {pdfLoading ? (
                    <span className="spinner-dark" />
                  ) : (
                    <Icon d={Icons.download} size={15} />
                  )}
                  {pdfLoading ? "Generating…" : "Download Report"}
                </button>
              </div>

              {/* Score cards row */}
              <div className="score-cards">
                <div className="score-card">
                  <p className="score-card-label">ATS Score</p>
                  <p
                    className="score-card-val"
                    style={{ color: "var(--accent)" }}
                  >
                    {Math.round(result.score.ats_score)}
                    <span>/100</span>
                  </p>
                </div>
                <div className="score-card">
                  <p className="score-card-label">Keyword Match</p>
                  <p className="score-card-val" style={{ color: "#22d3ee" }}>
                    {Math.round(result.score.keyword_score)}
                    <span>%</span>
                  </p>
                </div>
                <div className="score-card">
                  <p className="score-card-label">Semantic Match</p>
                  <p className="score-card-val" style={{ color: "#a78bfa" }}>
                    {Math.round(result.score.semantic_score)}
                    <span>%</span>
                  </p>
                </div>
                <div className="score-card">
                  <p className="score-card-label">Skills Missing</p>
                  <p
                    className="score-card-val"
                    style={{ color: "var(--missing-text)" }}
                  >
                    {result.score.missing_skills.length}
                    <span> skills</span>
                  </p>
                </div>
              </div>

              {/* Score Rings */}
              <div className="card">
                <div className="score-rings">
                  <ScoreRing
                    score={result.score.ats_score}
                    label="Overall ATS Score"
                    color="var(--accent)"
                    delay={0}
                  />
                  <ScoreRing
                    score={result.score.keyword_score}
                    label="Keyword Match"
                    color="#22d3ee"
                    delay={200}
                  />
                  <ScoreRing
                    score={result.score.semantic_score}
                    label="Semantic Match"
                    color="#a78bfa"
                    delay={400}
                  />
                </div>
              </div>

              {/* AI Feedback */}
              <div className="advice-box">
                <div className="advice-header">
                  <Icon d={Icons.brain} size={16} />
                  <span>AI Recruiter Feedback</span>
                </div>
                <div className="advice-body">
                  {result.advice
                    .split("\n")
                    .map((line, i) => line.trim() && <p key={i}>{line}</p>)}
                </div>
              </div>
            </div>
          )}

          {/* SKILLS */}
          {activePage === "skills" && result && (
            <div className="page-content animate-in">
              <div className="page-header">
                <h2 className="page-title">Skill Gap Analysis</h2>
                <p className="page-sub">
                  Skills matched and missing against the job description
                </p>
              </div>
              <div className="skills-grid">
                <div className="skills-col">
                  <h3 className="skills-col-title skills-col-title--matched">
                    <Icon d={Icons.check} size={16} /> Matched Skills (
                    {result.score.matched_skills.length})
                  </h3>
                  <div className="badges-wrap">
                    {result.score.matched_skills.length > 0 ? (
                      result.score.matched_skills.map((s) => (
                        <SkillBadge key={s} skill={s} type="matched" />
                      ))
                    ) : (
                      <p className="empty-state">No matched skills found</p>
                    )}
                  </div>
                </div>
                <div className="skills-col">
                  <h3 className="skills-col-title skills-col-title--missing">
                    <Icon d={Icons.x} size={16} /> Missing Skills (
                    {result.score.missing_skills.length})
                  </h3>
                  <div className="badges-wrap">
                    {result.score.missing_skills.length > 0 ? (
                      result.score.missing_skills.map((s) => (
                        <SkillBadge key={s} skill={s} type="missing" />
                      ))
                    ) : (
                      <p className="empty-state">
                        No missing skills — great match!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REWRITES */}
          {activePage === "rewrites" && result && (
            <div className="page-content animate-in">
              <div className="page-header">
                <h2 className="page-title">Resume Rewrites</h2>
                <p className="page-sub">
                  AI-rewritten bullet points to better highlight your skills for
                  this role
                </p>
              </div>
              <div className="rewrites-list">
                {rewrites.map((block, i) => (
                  <RewriteCard key={i} block={block} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* INTERVIEW */}
          {activePage === "interview" && result && (
            <div className="page-content animate-in">
              <div className="page-header">
                <h2 className="page-title">Interview Preparation</h2>
                <p className="page-sub">
                  Likely questions for this role, with one-line answering tips
                </p>
              </div>
              <div className="questions-list">
                {questions.map((q, i) => (
                  <QuestionCard key={i} text={q} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* JOBS */}
          {activePage === "jobs" && (
            <div className="page-content animate-in">
              <div className="page-header">
                <h2 className="page-title">Job Matches</h2>
                <p className="page-sub">
                  {jobsResult ? (
                    <>
                      Jobs matching your profile as:{" "}
                      {jobsResult.predicted_roles?.map((r) => (
                        <span
                          key={r}
                          className="skill-badge skill-badge--matched"
                          style={{ marginLeft: 6 }}
                        >
                          {r}
                        </span>
                      ))}
                    </>
                  ) : (
                    "Upload your resume and click Find Matching Jobs to see results"
                  )}
                </p>
              </div>

              {/* Location + Refresh */}
              {jobsResult && (
                <div className="jobs-controls">
                  <input
                    className="jd-input"
                    style={{ maxWidth: 200 }}
                    placeholder="Location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <button
                    className="jobs-refresh-btn"
                    onClick={refreshJobs}
                    disabled={jobsLoading}
                  >
                    {jobsLoading ? (
                      <span className="spinner-dark" />
                    ) : (
                      <Icon d={Icons.refresh} size={15} />
                    )}
                    Refresh
                  </button>
                </div>
              )}

              {!jobsResult && (
                <div className="empty-jobs">
                  <Icon d={Icons.search} size={40} />
                  <p>No job results yet</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Go to Analyse and click "Find Matching Jobs"
                  </p>
                </div>
              )}

              {jobsResult && (
                <div className="jobs-grid">
                  {jobsResult.jobs.map((job, i) => (
                    <div
                      key={i}
                      className="job-card"
                      style={{
                        animationDelay: `${i * 60}ms`,
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="job-card-header">
                        <div>
                          <p className="job-title">{job.title}</p>
                          <p className="job-company">{job.company}</p>
                        </div>
                        {job.employment_type && (
                          <span className="job-type">
                            {job.employment_type.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                      {job.location && (
                        <div className="job-meta">
                          <span className="job-meta-item">
                            <Icon d={Icons.location} size={13} />
                            {job.location}
                          </span>
                        </div>
                      )}
                      {job.matched_role && (
                        <span className="job-role-tag">
                          Matched for: {job.matched_role}
                        </span>
                      )}
                      {job.required_skills?.length > 0 && (
                        <div className="job-skills">
                          {job.required_skills.slice(0, 3).map((s, j) => (
                            <span key={j} className="job-skill-tag">
                              {s.length > 40 ? s.slice(0, 40) + "..." : s}
                            </span>
                          ))}
                        </div>
                      )}
                      {job.description && (
                        <p className="job-desc">{job.description}...</p>
                      )}
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Apply Now <Icon d={Icons.arrow} size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HISTORY */}
          {activePage === "history" && (
            <div className="page-content animate-in">
              <div className="page-header">
                <h2 className="page-title">Score History</h2>
                <p className="page-sub">Your ATS scores across past analyses</p>
              </div>
              {scoreHistory.length === 0 ? (
                <div className="empty-jobs">
                  <Icon d={Icons.history} size={36} />
                  <p>No history yet</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Scores are saved automatically each time you analyse
                  </p>
                </div>
              ) : (
                <>
                  <div className="card" style={{ marginBottom: 20 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 16,
                      }}
                    >
                      ATS Score History
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: "var(--text-muted)",
                          marginLeft: 8,
                        }}
                      >
                        last {scoreHistory.length} analyses
                      </span>
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 16,
                        height: 160,
                        paddingTop: 24,
                        overflowX: "auto",
                        paddingBottom: 8,
                      }}
                    >
                      {[...scoreHistory].reverse().map((entry, i) => (
                        <div
                          key={entry.id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              gap: 3,
                              height: 120,
                            }}
                          >
                            {[
                              { val: entry.ats, color: "var(--accent)" },
                              { val: entry.keyword, color: "#22d3ee" },
                              { val: entry.semantic, color: "#a78bfa" },
                            ].map((b, bi) => (
                              <div
                                key={bi}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 3,
                                  justifyContent: "flex-end",
                                  height: "100%",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 9,
                                    color: "var(--text-muted)",
                                    fontFamily: "'DM Mono',monospace",
                                  }}
                                >
                                  {b.val}
                                </span>
                                <div
                                  style={{
                                    width: 14,
                                    borderRadius: "3px 3px 0 0",
                                    background: b.color,
                                    height: `${b.val * 1.1}px`,
                                    minHeight: 4,
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--text-muted)",
                              textAlign: "center",
                            }}
                          >
                            {entry.date.split(" ").slice(0, 2).join(" ")}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              color: "var(--text-muted)",
                              fontFamily: "'DM Mono',monospace",
                              maxWidth: 60,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={entry.fileName}
                          >
                            {entry.fileName.replace(".pdf", "").slice(0, 10)}
                            {entry.fileName.length > 12 ? "…" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        flexWrap: "wrap",
                        marginTop: 16,
                        paddingTop: 14,
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      {[
                        ["var(--accent)", "ATS Score"],
                        ["#22d3ee", "Keywords"],
                        ["#a78bfa", "Semantic"],
                      ].map(([c, l]) => (
                        <span
                          key={l}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            color: "var(--text-muted)",
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 2,
                              background: c,
                              display: "inline-block",
                            }}
                          />{" "}
                          {l}
                        </span>
                      ))}
                      <button
                        onClick={() => {
                          localStorage.removeItem("ch_history");
                          setScoreHistory([]);
                        }}
                        style={{
                          marginLeft: "auto",
                          fontSize: 11,
                          color: "var(--missing-text)",
                          background: "transparent",
                          border: "1px solid var(--missing-border)",
                          borderRadius: 6,
                          padding: "3px 10px",
                          cursor: "pointer",
                          fontFamily: "'Outfit',sans-serif",
                        }}
                      >
                        Clear history
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                      }}
                    >
                      <thead>
                        <tr>
                          {["Date", "File", "ATS", "Keywords", "Semantic"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  padding: "10px 16px",
                                  textAlign: "left",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: "var(--text-muted)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  borderBottom: "1px solid var(--border)",
                                  background: "var(--surface-hover)",
                                }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {scoreHistory.map((entry) => (
                          <tr
                            key={entry.id}
                            style={{ borderBottom: "1px solid var(--border)" }}
                          >
                            <td
                              style={{
                                padding: "10px 16px",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {entry.date}
                            </td>
                            <td
                              style={{
                                padding: "10px 16px",
                                fontSize: 11,
                                color: "var(--text-muted)",
                                fontFamily: "'DM Mono',monospace",
                                maxWidth: 160,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {entry.fileName}
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontFamily: "'DM Mono',monospace",
                                  color: "var(--accent)",
                                }}
                              >
                                {entry.ats}
                              </span>
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontFamily: "'DM Mono',monospace",
                                  color: "#22d3ee",
                                }}
                              >
                                {entry.keyword}
                              </span>
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontFamily: "'DM Mono',monospace",
                                  color: "#a78bfa",
                                }}
                              >
                                {entry.semantic}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────
