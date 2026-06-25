import QuestionCard from "../components/QuestionCard.jsx";

export default function InterviewPage({ questions }) {
  return (
    <div className="page-content animate-in">
      <div className="page-header">
        <h2 className="page-title">Interview Preparation</h2>
        <p className="page-sub">
          Likely questions for this role, with one-line answering tips
        </p>
      </div>
      <div className="questions-list">
        {questions.map((q, i) => (
          <QuestionCard key={i} text={q} index={i} />
        ))}
      </div>
    </div>
  );
}
