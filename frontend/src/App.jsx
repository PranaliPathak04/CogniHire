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
import DashboardPage from "./pages/DashboardPage.jsx";
import SkillsPage from "./pages/SkillsPage.jsx";
import RewritesPage from "./pages/RewritesPage.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

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

      <div className="orb orb-3" />

      {/* Top Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div
              className="brand-icon"
              style={{
                background: "#0f172a",
                border: "1.5px solid #38bdf8",
                borderRadius: 8,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {/* Document */}
                <rect
                  x="4"
                  y="3"
                  width="12"
                  height="14"
                  rx="2"
                  stroke="white"
                  strokeWidth="1.3"
                />
                {/* Lines */}
                <line
                  x1="6.5"
                  y1="7.5"
                  x2="13.5"
                  y2="7.5"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <line
                  x1="6.5"
                  y1="10"
                  x2="13.5"
                  y2="10"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <line
                  x1="6.5"
                  y1="12.5"
                  x2="10.5"
                  y2="12.5"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                {/* Scan line */}
                <line
                  x1="3"
                  y1="10"
                  x2="17"
                  y2="10"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
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
          {activePage === "home" && (
            <UploadPage
              onAnalyze={handleAnalyze}
              onJobSearch={handleJobSearch}
              loading={loading}
              jobsLoading={jobsLoading}
              error={error}
            />
          )}
          {activePage === "dashboard" && result && (
            <DashboardPage
              result={result}
              currentFile={currentFile}
              user={user}
              pdfLoading={pdfLoading}
              setPdfLoading={setPdfLoading}
            />
          )}
          {activePage === "skills" && result && <SkillsPage result={result} />}
          {activePage === "rewrites" && result && (
            <RewritesPage rewrites={rewrites} />
          )}
          {activePage === "interview" && result && (
            <InterviewPage questions={questions} />
          )}
          {activePage === "jobs" && (
            <JobsPage
              jobsResult={jobsResult}
              jobsLoading={jobsLoading}
              location={location}
              setLocation={setLocation}
              refreshJobs={refreshJobs}
              setSelectedJob={setSelectedJob}
            />
          )}
          {activePage === "history" && (
            <HistoryPage
              scoreHistory={scoreHistory}
              setScoreHistory={setScoreHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────
