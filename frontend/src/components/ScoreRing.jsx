import { Icons, Icon } from "../constants/icons";

export default function ScoreRing({ score, label, color, delay = 0 }) {
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
