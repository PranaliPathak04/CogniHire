import { Icon, Icons } from "../constants/icons.jsx";

export default function RewriteCard({ block, index }) {
  if (!block) return null;
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Before */}
        <div
          style={{
            padding: "16px 20px",
            borderRight: "0.5px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#E24B4A",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#A32D2D",
              }}
            >
              Before
            </span>
          </div>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {original}
          </p>
        </div>

        {/* After */}
        <div style={{ padding: "16px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#639922",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#3B6D11",
              }}
            >
              After
            </span>
          </div>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {rewritten}
          </p>
        </div>
      </div>
    </div>
  );
}
