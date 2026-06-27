import { useState } from "react";

const CATEGORY_COLORS = {
  Technical: { label: "#185FA5" },
  Conceptual: { label: "#3B6D11" },
  Behavioral: { label: "#993C1D" },
};

export default function QuestionCard({ text, index }) {
  const lines = text.split("\n").filter(Boolean);
  const question = lines
    .find((l) => l.startsWith("QUESTION:"))
    ?.replace("QUESTION:", "")
    .trim();
  const tip = lines
    .find((l) => l.startsWith("TIP:"))
    ?.replace("TIP:", "")
    .trim();
  const category =
    lines
      .find((l) => l.startsWith("CATEGORY:"))
      ?.replace("CATEGORY:", "")
      .trim() || "Technical";

  if (!question) return null;

  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Technical;

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        marginBottom: 22,
        alignItems: "flex-start",
      }}
    >
      {/* Circle number */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text-secondary)",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          paddingBottom: 22,
          borderBottom: "0.5px solid var(--border)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: colors.label,
            display: "block",
            marginBottom: 6,
          }}
        >
          {category}
        </span>
        <p
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--text-primary)",
            lineHeight: 1.55,
            margin: "0 0 10px",
          }}
        >
          {question}
        </p>
        {tip && (
          <p
            style={{
              fontSize: 17,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              paddingLeft: 12,
              borderLeft: "2px solid var(--border)",
              margin: 0,
            }}
          >
            {tip}
          </p>
        )}
      </div>
    </div>
  );
}
