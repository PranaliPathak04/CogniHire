import { Icon, Icons } from "../constants/icons.jsx";

export default function RewriteCard({ block, index }) {
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
