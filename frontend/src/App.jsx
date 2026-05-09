import { useState, useCallback, useRef } from "react";
import axios from "axios";

const API = "http://localhost:8000";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  sun: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5-5 5m5-5v12",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zm-2 0v6h6",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  brain:
    "M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7v0a2.5 2.5 0 010 5v0A2.5 2.5 0 017 14.5v0A2.5 2.5 0 009.5 17h5a2.5 2.5 0 002.5-2.5v0a2.5 2.5 0 002.5-2.5v0a2.5 2.5 0 000-5v0A2.5 2.5 0 0017 4.5v0A2.5 2.5 0 0014.5 2z",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  chevron: "M9 18l6-6-6-6",
  sparkles:
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17.657 17.657l-.707-.707M12 21v-1m-5.657-2.343l-.707.707M4 12H3M6.343 6.343l-.707-.707",
  arrow: "M5 12h14M12 5l7 7-7 7",
};

// ── Animated Score Ring ────────────────────────────────────────────────────
function ScoreRing({ score, label, color, delay = 0 }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="score-ring-wrap" style={{ animationDelay: `${delay}ms` }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke="var(--ring-bg)"
          strokeWidth="10"
        />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)",
            transitionDelay: `${delay}ms`,
          }}
        />
        <text
          x="65"
          y="60"
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="22"
          fontWeight="700"
          fontFamily="'DM Mono', monospace"
        >
          {Math.round(score)}
        </text>
        <text
          x="65"
          y="78"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="10"
          fontFamily="'Outfit', sans-serif"
        >
          / 100
        </text>
      </svg>
      <p className="ring-label">{label}</p>
    </div>
  );
}

// ── Skill Badge ────────────────────────────────────────────────────────────
function SkillBadge({ skill, type }) {
  return (
    <span className={`skill-badge skill-badge--${type}`}>
      {type === "matched" ? (
        <Icon d={Icons.check} size={12} />
      ) : (
        <Icon d={Icons.x} size={12} />
      )}
      {skill.replace(/_/g, " ")}
    </span>
  );
}

// ── Tab ───────────────────────────────────────────────────────────────────
function Tab({ label, icon, active, onClick, count }) {
  return (
    <button
      className={`tab-btn ${active ? "tab-btn--active" : ""}`}
      onClick={onClick}
    >
      <Icon d={icon} size={16} />
      <span>{label}</span>
      {count != null && <span className="tab-count">{count}</span>}
    </button>
  );
}

// ── Rewrite Card ──────────────────────────────────────────────────────────
function RewriteCard({ block, index }) {
  const lines = block.split("\n").filter(Boolean);
  const original = lines
    .find((l) => l.startsWith("ORIGINAL:"))
    ?.replace("ORIGINAL:", "")
    .trim();
  const rewritten = lines
    .find((l) => l.startsWith("REWRITTEN:"))
    ?.replace("REWRITTEN:", "")
    .trim();
  if (!original || !rewritten) return null;
  return (
    <div className="rewrite-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="rewrite-section rewrite-section--before">
        <span className="rewrite-label">Before</span>
        <p>{original}</p>
      </div>
      <div className="rewrite-arrow">
        <Icon d={Icons.arrow} size={18} />
      </div>
      <div className="rewrite-section rewrite-section--after">
        <span className="rewrite-label">After</span>
        <p>{rewritten}</p>
      </div>
    </div>
  );
}

// ── Interview Question Card ───────────────────────────────────────────────
function QuestionCard({ text, index }) {
  const [open, setOpen] = useState(false);
  const tipMatch = text.match(/tip[:\s]+(.+)/i);
  const question = text
    .replace(/tip[:\s]+.+/i, "")
    .replace(/^\d+\.\s*/, "")
    .trim();
  return (
    <div
      className={`question-card ${open ? "question-card--open" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button className="question-header" onClick={() => setOpen(!open)}>
        <span className="question-num">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="question-text">{question}</span>
        <Icon d={Icons.chevron} size={16} />
      </button>
      {open && tipMatch && (
        <div className="question-tip">
          <Icon d={Icons.zap} size={14} />
          <span>{tipMatch[1]}</span>
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdUrl, setJdUrl] = useState("");
  const [jdMode, setJdMode] = useState("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("score");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
    else setError("Please upload a PDF file.");
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const analyze = async () => {
    if (!file) return setError("Please upload a resume PDF.");
    if (jdMode === "text" && !jdText.trim())
      return setError("Please enter a job description.");
    if (jdMode === "url" && !jdUrl.trim())
      return setError("Please enter a job URL.");
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      if (jdMode === "text") fd.append("jd_text", jdText);
      else fd.append("jd_url", jdUrl);
      const { data } = await axios.post(`${API}/analyze`, fd);
      setResult(data);
      setTab("score");
    } catch (e) {
      setError(
        e.response?.data?.detail ||
          "Something went wrong. Is the backend running?",
      );
    } finally {
      setLoading(false);
    }
  };

  const questions = result?.interview_questions
    ? result.interview_questions.split(/\n(?=\d+\.)/).filter(Boolean)
    : [];
  const rewrites = result?.rewrites
    ? result.rewrites.split(/\n(?=ORIGINAL:)/).filter(Boolean)
    : [];

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      <style>{css}</style>

      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand-icon">
              <Icon d={Icons.zap} size={18} fill="currentColor" stroke="none" />
            </div>
            <span className="brand-name">CogniHire</span>
            <span className="brand-tag">AI</span>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)}>
            <Icon d={dark ? Icons.sun : Icons.moon} size={18} />
          </button>
        </div>
      </nav>

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-eyebrow">
            <Icon d={Icons.sparkles} size={14} />
            <span>Powered by Llama 3.3 · 70B</span>
          </div>
          <h1 className="hero-title">
            Land the job
            <br />
            <span className="hero-gradient">you actually want</span>
          </h1>
          <p className="hero-sub">
            Drop your resume. Paste the job description. Get an ATS score,
            <br />
            skill gap analysis, rewritten bullet points, and interview prep —
            instantly.
          </p>
        </section>

        {/* Upload Card */}
        <div className="card upload-card">
          <div className="card-grid">
            {/* Resume drop zone */}
            <div>
              <p className="field-label">
                Your Resume <span className="required">*</span>
              </p>
              <div
                className={`dropzone ${dragging ? "dropzone--active" : ""} ${file ? "dropzone--filled" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {file ? (
                  <>
                    <div className="drop-icon drop-icon--success">
                      <Icon d={Icons.file} size={24} />
                    </div>
                    <p className="drop-filename">{file.name}</p>
                    <p className="drop-hint">Click to change</p>
                  </>
                ) : (
                  <>
                    <div className="drop-icon">
                      <Icon d={Icons.upload} size={24} />
                    </div>
                    <p className="drop-main">Drop your PDF here</p>
                    <p className="drop-hint">or click to browse</p>
                  </>
                )}
              </div>
            </div>

            {/* JD input */}
            <div>
              <div className="jd-header">
                <p className="field-label">
                  Job Description <span className="required">*</span>
                </p>
                <div className="jd-toggle">
                  <button
                    className={jdMode === "text" ? "active" : ""}
                    onClick={() => setJdMode("text")}
                  >
                    Text
                  </button>
                  <button
                    className={jdMode === "url" ? "active" : ""}
                    onClick={() => setJdMode("url")}
                  >
                    <Icon d={Icons.link} size={12} /> URL
                  </button>
                </div>
              </div>
              {jdMode === "text" ? (
                <textarea
                  className="jd-textarea"
                  placeholder="Paste the job description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              ) : (
                <input
                  className="jd-input"
                  placeholder="https://linkedin.com/jobs/..."
                  value={jdUrl}
                  onChange={(e) => setJdUrl(e.target.value)}
                />
              )}
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <Icon d={Icons.x} size={14} />
              {error}
            </div>
          )}

          <button
            className={`analyze-btn ${loading ? "analyze-btn--loading" : ""}`}
            onClick={analyze}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Analysing your resume...
              </>
            ) : (
              <>
                <Icon
                  d={Icons.zap}
                  size={18}
                  fill="currentColor"
                  stroke="none"
                />
                Analyse Resume
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="results-wrap">
            {/* Tabs */}
            <div className="tabs">
              <Tab
                label="Score"
                icon={Icons.star}
                active={tab === "score"}
                onClick={() => setTab("score")}
              />
              <Tab
                label="Skills"
                icon={Icons.check}
                active={tab === "skills"}
                onClick={() => setTab("skills")}
                count={
                  result.score.missing_skills.length > 0
                    ? result.score.missing_skills.length + " missing"
                    : null
                }
              />
              <Tab
                label="Rewrites"
                icon={Icons.edit}
                active={tab === "rewrites"}
                onClick={() => setTab("rewrites")}
                count={rewrites.length}
              />
              <Tab
                label="Interview Prep"
                icon={Icons.brain}
                active={tab === "interview"}
                onClick={() => setTab("interview")}
                count={questions.length}
              />
            </div>

            {/* Score Tab */}
            {tab === "score" && (
              <div className="tab-content">
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

            {/* Skills Tab */}
            {tab === "skills" && (
              <div className="tab-content">
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

            {/* Rewrites Tab */}
            {tab === "rewrites" && (
              <div className="tab-content">
                <p className="tab-description">
                  AI-rewritten bullet points to better highlight your skills for
                  this role.
                </p>
                <div className="rewrites-list">
                  {rewrites.map((block, i) => (
                    <RewriteCard key={i} block={block} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Interview Tab */}
            {tab === "interview" && (
              <div className="tab-content">
                <p className="tab-description">
                  Likely questions for this role, with one-line answering tips.
                </p>
                <div className="questions-list">
                  {questions.map((q, i) => (
                    <QuestionCard key={i} text={q} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>CogniHire · Built with Groq + spaCy + React</p>
      </footer>
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dark {
  --bg: #080c14;
  --surface: rgba(255,255,255,0.04);
  --surface-hover: rgba(255,255,255,0.07);
  --border: rgba(255,255,255,0.08);
  --border-focus: rgba(99,179,237,0.5);
  --text-primary: #f0f4ff;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent: #38bdf8;
  --accent-glow: rgba(56,189,248,0.2);
  --accent-btn: linear-gradient(135deg, #0ea5e9, #6366f1);
  --ring-bg: rgba(255,255,255,0.06);
  --orb1: rgba(56,189,248,0.12);
  --orb2: rgba(99,102,241,0.10);
  --orb3: rgba(168,85,247,0.08);
  --matched: rgba(34,197,94,0.15);
  --matched-text: #4ade80;
  --matched-border: rgba(34,197,94,0.3);
  --missing: rgba(239,68,68,0.15);
  --missing-text: #f87171;
  --missing-border: rgba(239,68,68,0.3);
  --rewrite-before: rgba(239,68,68,0.06);
  --rewrite-after: rgba(34,197,94,0.06);
}

.light {
  --bg: #f0f4ff;
  --surface: rgba(255,255,255,0.85);
  --surface-hover: rgba(255,255,255,0.95);
  --border: rgba(0,0,0,0.08);
  --border-focus: rgba(14,165,233,0.4);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --accent: #0ea5e9;
  --accent-glow: rgba(14,165,233,0.15);
  --accent-btn: linear-gradient(135deg, #0ea5e9, #6366f1);
  --ring-bg: rgba(0,0,0,0.06);
  --orb1: rgba(56,189,248,0.18);
  --orb2: rgba(99,102,241,0.14);
  --orb3: rgba(168,85,247,0.12);
  --matched: rgba(34,197,94,0.12);
  --matched-text: #16a34a;
  --matched-border: rgba(34,197,94,0.3);
  --missing: rgba(239,68,68,0.10);
  --missing-text: #dc2626;
  --missing-border: rgba(239,68,68,0.25);
  --rewrite-before: rgba(239,68,68,0.04);
  --rewrite-after: rgba(34,197,94,0.05);
}

.app {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow-x: hidden;
  transition: background 0.3s, color 0.3s;
}

/* Orbs */
.orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.orb-1 { width: 600px; height: 600px; background: var(--orb1); top: -200px; right: -100px; animation: drift1 18s ease-in-out infinite; }
.orb-2 { width: 500px; height: 500px; background: var(--orb2); bottom: 0; left: -150px; animation: drift2 22s ease-in-out infinite; }
.orb-3 { width: 400px; height: 400px; background: var(--orb3); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: drift3 16s ease-in-out infinite; }
@keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px, 60px) scale(1.1); } }
@keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(50px, -40px) scale(0.9); } }
@keyframes drift3 { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.15); } }

/* Nav */
.nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--surface); border-bottom: 1px solid var(--border); }
.nav-inner { max-width: 960px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
.nav-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { width: 32px; height: 32px; background: var(--accent-btn); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
.brand-name { font-size: 18px; font-weight: 700; letter-spacing: -0.5px; color: var(--text-primary); }
.brand-tag { font-size: 10px; font-weight: 600; background: var(--accent-btn); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 1px; padding-top: 2px; }
.theme-toggle { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.2s; }
.theme-toggle:hover { background: var(--surface-hover); color: var(--text-primary); border-color: var(--accent); }

/* Main */
.main { position: relative; z-index: 1; max-width: 960px; margin: 0 auto; padding: 60px 24px 80px; }

/* Hero */
.hero { text-align: center; margin-bottom: 56px; }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: var(--accent); background: var(--accent-glow); border: 1px solid var(--border-focus); border-radius: 100px; padding: 6px 14px; margin-bottom: 24px; letter-spacing: 0.5px; }
.hero-title { font-size: clamp(42px, 7vw, 72px); font-weight: 800; line-height: 1.08; letter-spacing: -2px; color: var(--text-primary); margin-bottom: 20px; }
.hero-gradient { background: var(--accent-btn); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-sub { font-size: 17px; color: var(--text-secondary); line-height: 1.7; font-weight: 400; }

/* Card */
.card { background: var(--surface); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 24px; padding: 32px; margin-bottom: 32px; }

/* Upload Card */
.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
@media (max-width: 640px) { .card-grid { grid-template-columns: 1fr; } }
.field-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 10px; }
.required { color: var(--accent); }

/* Dropzone */
.dropzone { border: 2px dashed var(--border); border-radius: 16px; padding: 32px 20px; text-align: center; cursor: pointer; transition: all 0.25s; background: transparent; }
.dropzone:hover, .dropzone--active { border-color: var(--accent); background: var(--accent-glow); }
.dropzone--filled { border-style: solid; border-color: var(--matched-border); background: var(--matched); }
.drop-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--surface-hover); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: var(--text-muted); }
.drop-icon--success { color: var(--matched-text); border-color: var(--matched-border); background: var(--matched); }
.drop-main { font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.drop-filename { font-size: 13px; font-weight: 600; color: var(--matched-text); margin-bottom: 4px; word-break: break-all; }
.drop-hint { font-size: 12px; color: var(--text-muted); }

/* JD */
.jd-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.jd-toggle { display: flex; background: var(--surface-hover); border: 1px solid var(--border); border-radius: 10px; padding: 3px; gap: 3px; }
.jd-toggle button { padding: 5px 12px; border-radius: 7px; border: none; background: transparent; color: var(--text-muted); font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s; font-family: 'Outfit', sans-serif; }
.jd-toggle button.active { background: var(--accent-btn); color: white; }
.jd-textarea { width: 100%; height: 180px; resize: none; background: var(--surface-hover); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; font-size: 14px; font-family: 'Outfit', sans-serif; color: var(--text-primary); outline: none; transition: border-color 0.2s; line-height: 1.6; }
.jd-textarea:focus { border-color: var(--border-focus); }
.jd-textarea::placeholder { color: var(--text-muted); }
.jd-input { width: 100%; background: var(--surface-hover); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; font-size: 14px; font-family: 'Outfit', sans-serif; color: var(--text-primary); outline: none; transition: border-color 0.2s; }
.jd-input:focus { border-color: var(--border-focus); }
.jd-input::placeholder { color: var(--text-muted); }

/* Error */
.error-banner { display: flex; align-items: center; gap: 8px; background: var(--missing); border: 1px solid var(--missing-border); color: var(--missing-text); border-radius: 12px; padding: 12px 16px; font-size: 14px; margin-bottom: 16px; }

/* Analyze Button */
.analyze-btn { width: 100%; padding: 16px; background: var(--accent-btn); color: white; border: none; border-radius: 16px; font-size: 16px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.25s; letter-spacing: 0.3px; position: relative; overflow: hidden; }
.analyze-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); }
.analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(14,165,233,0.35); }
.analyze-btn:active:not(:disabled) { transform: translateY(0); }
.analyze-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.analyze-btn--loading { background: var(--accent-btn); }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Results */
.results-wrap { animation: fadeUp 0.5s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Tabs */
.tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); font-size: 14px; font-weight: 500; font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.2s; }
.tab-btn:hover { background: var(--surface-hover); color: var(--text-primary); }
.tab-btn--active { background: var(--accent-btn); color: white; border-color: transparent; }
.tab-count { font-size: 11px; background: rgba(255,255,255,0.2); border-radius: 100px; padding: 2px 8px; font-weight: 600; }
.tab-btn:not(.tab-btn--active) .tab-count { background: var(--surface-hover); color: var(--text-muted); }

/* Tab Content */
.tab-content { animation: fadeUp 0.3s ease both; }
.tab-description { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }

/* Score Rings */
.score-rings { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; padding: 32px 0; }
.score-ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; animation: fadeUp 0.5s ease both; }
.ring-label { font-size: 13px; font-weight: 500; color: var(--text-muted); text-align: center; }

/* Advice Box */
.advice-box { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
.advice-header { display: flex; align-items: center; gap: 8px; padding: 16px 20px; border-bottom: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
.advice-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto; }
.advice-body p { font-size: 14px; line-height: 1.7; color: var(--text-secondary); }
.advice-body::-webkit-scrollbar { width: 4px; }
.advice-body::-webkit-scrollbar-track { background: transparent; }
.advice-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* Skills */
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 640px) { .skills-grid { grid-template-columns: 1fr; } }
.skills-col { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 20px; }
.skills-col-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.skills-col-title--matched { color: var(--matched-text); }
.skills-col-title--missing { color: var(--missing-text); }
.badges-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 500; font-family: 'DM Mono', monospace; text-transform: capitalize; border: 1px solid; }
.skill-badge--matched { background: var(--matched); color: var(--matched-text); border-color: var(--matched-border); }
.skill-badge--missing { background: var(--missing); color: var(--missing-text); border-color: var(--missing-border); }
.empty-state { font-size: 13px; color: var(--text-muted); font-style: italic; }

/* Rewrites */
.rewrites-list { display: flex; flex-direction: column; gap: 16px; }
.rewrite-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; animation: fadeUp 0.4s ease both; }
.rewrite-section { padding: 16px 20px; }
.rewrite-section--before { background: var(--rewrite-before); }
.rewrite-section--after { background: var(--rewrite-after); }
.rewrite-label { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
.rewrite-section--before .rewrite-label { color: var(--missing-text); }
.rewrite-section--after .rewrite-label { color: var(--matched-text); }
.rewrite-section p { font-size: 14px; line-height: 1.6; color: var(--text-secondary); }
.rewrite-arrow { display: flex; align-items: center; justify-content: center; padding: 10px; color: var(--accent); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--surface-hover); }

/* Questions */
.questions-list { display: flex; flex-direction: column; gap: 10px; }
.question-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.4s ease both; transition: border-color 0.2s; }
.question-card--open { border-color: var(--border-focus); }
.question-header { width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: transparent; border: none; cursor: pointer; text-align: left; color: var(--text-primary); font-family: 'Outfit', sans-serif; transition: background 0.2s; }
.question-header:hover { background: var(--surface-hover); }
.question-num { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--accent); font-weight: 500; min-width: 28px; }
.question-text { flex: 1; font-size: 14px; font-weight: 500; line-height: 1.5; }
.question-tip { display: flex; align-items: flex-start; gap: 8px; padding: 14px 20px 14px 62px; background: var(--accent-glow); border-top: 1px solid var(--border-focus); font-size: 13px; color: var(--accent); line-height: 1.5; }

/* Footer */
.footer { position: relative; z-index: 1; text-align: center; padding: 32px 24px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-muted); }
`;
