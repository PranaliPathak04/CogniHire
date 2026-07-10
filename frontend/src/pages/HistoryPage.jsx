import { Icon, Icons } from "../constants/icons.jsx";

function AtsTrendChart({ scoreHistory }) {
  // chronological order, oldest -> newest, left to right
  const data = [...scoreHistory].reverse();
  const width = 900;
  const height = 220;
  const padX = 40;
  const padTop = 30;
  const padBottom = 40;
  const chartW = width - padX * 2;
  const chartH = height - padTop - padBottom;

  const n = data.length;
  const points = data.map((entry, i) => {
    const x = n === 1 ? padX + chartW / 2 : padX + (i / (n - 1)) * chartW;
    const y = padTop + chartH - (entry.ats / 100) * chartH;
    return { x, y, entry };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`
      : "";

  // gridlines at 0/25/50/75/100
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="atsTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines + y labels */}
      {gridLines.map((g) => {
        const y = padTop + chartH - (g / 100) * chartH;
        return (
          <g key={g}>
            <line
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={padX - 10}
              y={y + 4}
              fontSize="10"
              fill="var(--text-muted)"
              textAnchor="end"
              fontFamily="'DM Mono', monospace"
            >
              {g}
            </text>
          </g>
        );
      })}

      {/* filled area under line */}
      {points.length > 1 && <path d={areaPath} fill="url(#atsTrendFill)" />}

      {/* the line */}
      {points.length > 1 && (
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* points + value labels + date labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill="var(--bg)"
            stroke="var(--accent)"
            strokeWidth="2.5"
          />
          <text
            x={p.x}
            y={p.y - 12}
            fontSize="11"
            fontWeight="700"
            fill="var(--text-primary)"
            textAnchor="middle"
            fontFamily="'DM Mono', monospace"
          >
            {p.entry.ats}
          </text>
          <text
            x={p.x}
            y={height - 14}
            fontSize="10"
            fill="var(--text-muted)"
            textAnchor="middle"
          >
            {p.entry.date.split(" ").slice(0, 2).join(" ")}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function HistoryPage({ scoreHistory, setScoreHistory }) {
  return (
    <div className="page-content animate-in">
      <div className="page-header">
        <h2 className="page-title">Score History</h2>
        <p className="page-sub">Your ATS scores across past analyses</p>
      </div>
      {scoreHistory.length === 0 ? (
        <div className="empty-jobs">
          <Icon d={Icons.history} size={36} />
          <p>No history yet</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Scores are saved automatically each time you analyse
          </p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                ATS Score Trend
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: "var(--text-muted)",
                    marginLeft: 8,
                  }}
                >
                  last {scoreHistory.length} analyses
                </span>
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem("ch_history");
                  setScoreHistory([]);
                }}
                style={{
                  fontSize: 11,
                  color: "var(--missing-text)",
                  background: "transparent",
                  border: "1px solid var(--missing-border)",
                  borderRadius: 6,
                  padding: "3px 10px",
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                Clear history
              </button>
            </div>

            <AtsTrendChart scoreHistory={scoreHistory} />
          </div>

          {/* Table stays exactly as before */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {["Date", "File", "ATS", "Keywords", "Semantic"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "1px solid var(--border)",
                        background: "var(--surface-hover)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoreHistory.map((entry) => (
                  <tr
                    key={entry.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      style={{
                        padding: "10px 16px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {entry.date}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: 11,
                        color: "var(--text-muted)",
                        fontFamily: "'DM Mono',monospace",
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.fileName}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: "'DM Mono',monospace",
                          color: "var(--accent)",
                        }}
                      >
                        {entry.ats}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: "'DM Mono',monospace",
                          color: "#22d3ee",
                        }}
                      >
                        {entry.keyword}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: "'DM Mono',monospace",
                          color: "#a78bfa",
                        }}
                      >
                        {entry.semantic}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
