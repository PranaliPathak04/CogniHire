import { Icon, Icons } from "../constants/icons.jsx";

export default function JobModal({ job, onClose }) {
  if (!job) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",

        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 680,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {job.title}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--accent)",
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              {job.company}
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {job.location && (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Icon d={Icons.location} size={12} /> {job.location}
                </span>
              )}
              {job.employment_type && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    background: "var(--accent-glow)",
                    color: "var(--accent)",
                    border: "1px solid var(--border-focus)",
                    borderRadius: 100,
                    padding: "3px 10px",
                  }}
                >
                  {job.employment_type.replace(/_/g, " ")}
                </span>
              )}
              {job.matched_role && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  Matched for: {job.matched_role}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--surface-hover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            <Icon d={Icons.x} size={16} />
          </button>
        </div>

        {/* Required skills */}
        {job.required_skills?.length > 0 && (
          <div
            style={{
              padding: "14px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {job.required_skills.map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  background: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "3px 10px",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Full JD */}
        <div
          className="job-modal-body"
          style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 12,
            }}
          >
            Job Description
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {job.description || "No description available."}
          </p>
        </div>

        {/* Footer with Apply */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 10,
          }}
        >
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "12px",
              background: "var(--accent-btn)",
              color: "white",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Apply Now <Icon d={Icons.arrow} size={14} />
          </a>
          <button
            onClick={onClose}
            style={{
              padding: "12px 20px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
