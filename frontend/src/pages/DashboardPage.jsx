import { Icon, Icons } from "../constants/icons.jsx";
import ScoreRing from "../components/ScoreRing.jsx";
import { generatePDF } from "../utils/generatePDF.js";

export default function DashboardPage({
  result,
  currentFile,
  user,
  pdfLoading,
  setPdfLoading,
}) {
  return (
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

      <div className="score-cards">
        <div className="score-card">
          <p className="score-card-label">ATS Score</p>
          <p className="score-card-val" style={{ color: "var(--accent)" }}>
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

      <div className="advice-box">
        <div className="advice-header">
          <Icon d={Icons.brain} size={16} />
          <span>AI Recruiter Feedback</span>
        </div>
        <div className="advice-body">
          {result.advice.split("\n").map((line, i) => {
            if (!line.trim()) return null;

            // bold headers like **Summary and Education:**
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <p
                  key={i}
                  style={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginTop: 8,
                  }}
                >
                  {line.replace(/\*\*/g, "")}
                </p>
              );
            }

            // inline bold + text like **Additional Tips:**
            const boldFormatted = line.replace(
              /\*\*(.*?)\*\*/g,
              "<strong>$1</strong>",
            );

            // bullet points starting with -
            if (line.startsWith("- ")) {
              return (
                <p
                  key={i}
                  style={{
                    paddingLeft: 16,
                    borderLeft: "2px solid var(--accent)",
                    marginLeft: 8,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: "• " + boldFormatted.slice(2),
                  }}
                />
              );
            }

            // numbered points like 1. 2. 3.
            if (/^\d+\./.test(line)) {
              return (
                <p
                  key={i}
                  style={{ paddingLeft: 16 }}
                  dangerouslySetInnerHTML={{ __html: boldFormatted }}
                />
              );
            }

            return (
              <p key={i} dangerouslySetInnerHTML={{ __html: boldFormatted }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
