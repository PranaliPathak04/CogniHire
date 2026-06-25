import { Icon, Icons } from "../constants/icons.jsx";

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
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: 16,
              }}
            >
              ATS Score History
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
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 16,
                height: 160,
                paddingTop: 24,
                overflowX: "auto",
                paddingBottom: 8,
              }}
            >
              {[...scoreHistory].reverse().map((entry, i) => (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 3,
                      height: 120,
                    }}
                  >
                    {[
                      { val: entry.ats, color: "var(--accent)" },
                      { val: entry.keyword, color: "#22d3ee" },
                      { val: entry.semantic, color: "#a78bfa" },
                    ].map((b, bi) => (
                      <div
                        key={bi}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                          justifyContent: "flex-end",
                          height: "100%",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            color: "var(--text-muted)",
                            fontFamily: "'DM Mono',monospace",
                          }}
                        >
                          {b.val}
                        </span>
                        <div
                          style={{
                            width: 14,
                            borderRadius: "3px 3px 0 0",
                            background: b.color,
                            height: `${b.val * 1.1}px`,
                            minHeight: 4,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      textAlign: "center",
                    }}
                  >
                    {entry.date.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "var(--text-muted)",
                      fontFamily: "'DM Mono',monospace",
                      maxWidth: 60,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={entry.fileName}
                  >
                    {entry.fileName.replace(".pdf", "").slice(0, 10)}
                    {entry.fileName.length > 12 ? "…" : ""}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 16,
                paddingTop: 14,
                borderTop: "1px solid var(--border)",
              }}
            >
              {[
                ["var(--accent)", "ATS Score"],
                ["#22d3ee", "Keywords"],
                ["#a78bfa", "Semantic"],
              ].map(([c, l]) => (
                <span
                  key={l}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: c,
                      display: "inline-block",
                    }}
                  />{" "}
                  {l}
                </span>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem("ch_history");
                  setScoreHistory([]);
                }}
                style={{
                  marginLeft: "auto",
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
          </div>

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
