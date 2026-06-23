import { Icon, Icons } from "../constants/icons.jsx";

export default function SkillBadge({ skill, type }) {
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
