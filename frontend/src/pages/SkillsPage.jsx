import { Icon, Icons } from "../constants/icons.jsx";
import SkillBadge from "../components/SkillBadge.jsx";

export default function SkillsPage({ result }) {
  const matched = result.score.matched_skills.length;
  const missing = result.score.missing_skills.length;
  const total = matched + missing;
  const coverage = total > 0 ? Math.round((matched / total) * 100) : 0;

  return (
    <div className="page-content animate-in">
      <div className="page-header">
        <h2 className="page-title">Skill Gap Analysis</h2>
        <p className="page-sub">
          Skills matched and missing against the job description
        </p>
      </div>

      {/* Stat row — mirrors the Dashboard cards for visual consistency */}
      <div className="score-cards" style={{ marginBottom: 28 }}>
        <div className="score-card">
          <p className="score-card-label">Total Skills Required</p>
          <p className="score-card-val" style={{ color: "var(--accent)" }}>
            {total}
          </p>
        </div>
        <div className="score-card">
          <p className="score-card-label">Matched</p>
          <p
            className="score-card-val"
            style={{ color: "var(--matched-text)" }}
          >
            {matched}
          </p>
        </div>
        <div className="score-card">
          <p className="score-card-label">Missing</p>
          <p
            className="score-card-val"
            style={{ color: "var(--missing-text)" }}
          >
            {missing}
          </p>
        </div>
        <div className="score-card">
          <p className="score-card-label">Coverage</p>
          <p className="score-card-val" style={{ color: "var(--accent)" }}>
            {coverage}
            <span>%</span>
          </p>
        </div>
      </div>

      {/* Coverage progress bar */}
      <div className="coverage-bar-wrap">
        <div className="coverage-bar-track">
          <div
            className="coverage-bar-fill"
            style={{ width: `${coverage}%` }}
          />
        </div>
        <p className="coverage-bar-caption">
          {coverage >= 80
            ? "Excellent match — you cover most of what this role needs."
            : coverage >= 50
              ? "Good match — a few gaps worth addressing below."
              : "Significant gaps — consider building projects around the missing skills."}
        </p>
      </div>

      <div className="skills-grid">
        <div className="skills-col">
          <h3 className="skills-col-title skills-col-title--matched">
            <Icon d={Icons.check} size={16} /> Matched Skills ({matched})
          </h3>
          <div className="badges-wrap">
            {matched > 0 ? (
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
            <Icon d={Icons.x} size={16} /> Missing Skills ({missing})
          </h3>
          <div className="badges-wrap">
            {missing > 0 ? (
              result.score.missing_skills.map((s) => (
                <SkillBadge key={s} skill={s} type="missing" />
              ))
            ) : (
              <p className="empty-state">No missing skills — great match!</p>
            )}
          </div>
          {missing > 0 && (
            <p className="skills-hint">
              💡 Check the <strong>Rewrites</strong> tab — some of these may
              already be addressed in your bullet points.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
