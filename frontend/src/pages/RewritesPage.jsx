import RewriteCard from "../components/RewriteCard.jsx";

export default function RewritesPage({ rewrites }) {
  return (
    <div className="page-content animate-in">
      <div className="page-header">
        <h2 className="page-title">Resume Rewrites</h2>
        <p className="page-sub">
          AI-rewritten bullet points to better highlight your skills for this
          role
        </p>
      </div>
      <div className="rewrites-list">
        {rewrites.map((block, i) => (
          <RewriteCard key={i} block={block} index={i} />
        ))}
      </div>
    </div>
  );
}
