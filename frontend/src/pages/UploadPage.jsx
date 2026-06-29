import { useState, useRef, useCallback, useEffect } from "react";
import { Icon, Icons } from "../constants/icons.jsx";

export default function UploadPage({
  onAnalyze,
  onJobSearch,
  loading,
  jobsLoading,
  error,
  prefillJd,
  prefillFile,
}) {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState(prefillJd || "");
  const [jdUrl, setJdUrl] = useState("");
  const [jdMode, setJdMode] = useState("text");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const loadingMessages = [
    "Reading your resume...",
    "Extracting your skills and experience...",
    "Predicting the best job roles for you...",
    "Searching live listings across India...",
    "Filtering out irrelevant results...",
    "Ranking jobs by your skill match...",
    "Almost there, hang tight...",
    "Just a few more seconds...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  useEffect(() => {
    if (!jobsLoading) {
      setMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMsgIndex((prev) => Math.min(prev + 1, loadingMessages.length - 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [jobsLoading]);

  useEffect(() => {
    if (prefillJd) {
      setJdText(prefillJd);
      setJdMode("text");
    }
  }, [prefillJd]);

  useEffect(() => {
    if (prefillFile) setFile(prefillFile);
  }, [prefillFile]);

  return (
    <div className="upload-page">
      <section className="hero">
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

      <div className="upload-card">
        <div className="card-grid">
          {/* Dropzone */}
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

          {/* JD */}
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
          onClick={() => onAnalyze(file, jdText, jdUrl, jdMode)}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analysing your resume...
            </>
          ) : (
            <>
              <Icon d={Icons.zap} size={18} fill="currentColor" stroke="none" />
              Analyse Resume
            </>
          )}
        </button>

        <button
          className="jobs-btn"
          onClick={() => onJobSearch(file)}
          disabled={jobsLoading || !file}
        >
          {jobsLoading ? (
            <>
              <span className="spinner" />
              Finding jobs...
            </>
          ) : (
            <>
              <Icon d={Icons.search} size={18} />
              Find Matching Jobs
            </>
          )}
        </button>
        {jobsLoading && (
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--text-muted)",
              marginTop: 10,
              transition: "all 0.3s",
              fontStyle: "italic",
            }}
          >
            {loadingMessages[msgIndex]}
          </p>
        )}
      </div>
    </div>
  );
}
