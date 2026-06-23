import { Icon, Icons } from "../constants/icons.jsx";
import { useState } from "react";

export default function QuestionCard({ text, index }) {
  const [open, setOpen] = useState(false);
  const tipMatch = text.match(/tip[:\s]+(.+)/i);
  const question = text
    .replace(/tip[:\s]+.+/i, "")
    .replace(/^\d+\.\s*/, "")
    .trim();
  return (
    <div
      className={`question-card ${open ? "question-card--open" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button className="question-header" onClick={() => setOpen(!open)}>
        <span className="question-num">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="question-text">{question}</span>
        <Icon d={Icons.chevron} size={16} />
      </button>
      {open && tipMatch && (
        <div className="question-tip">
          <Icon d={Icons.zap} size={14} />
          <span>{tipMatch[1]}</span>
        </div>
      )}
    </div>
  );
}
