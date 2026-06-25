import { Icon, Icons } from "../constants/icons.jsx";
import SkillBadge from "../components/SkillBadge.jsx";

export default function SkillsPage({ result }) {
  return (
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
              <p className="empty-state">No missing skills — great match!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
