import { Icon, Icons } from "../constants/icons.jsx";

export default function JobsPage({
  jobsResult,
  jobsLoading,
  location,
  setLocation,
  refreshJobs,
  setSelectedJob,
}) {
  return (
    <div className="page-content animate-in">
      <div className="page-header">
        <h2 className="page-title">Job Matches</h2>
        <p className="page-sub">
          {jobsResult ? (
            <>
              Jobs matching your profile as:{" "}
              {jobsResult.predicted_roles?.map((r) => (
                <span
                  key={r}
                  className="skill-badge skill-badge--matched"
                  style={{ marginLeft: 6 }}
                >
                  {r}
                </span>
              ))}
            </>
          ) : (
            "Upload your resume and click Find Matching Jobs to see results"
          )}
        </p>
      </div>

      {jobsResult && (
        <div className="jobs-controls">
          <input
            className="jd-input"
            style={{ maxWidth: 200 }}
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            className="jobs-refresh-btn"
            onClick={refreshJobs}
            disabled={jobsLoading}
          >
            {jobsLoading ? (
              <span className="spinner-dark" />
            ) : (
              <Icon d={Icons.refresh} size={15} />
            )}
            Refresh
          </button>
        </div>
      )}

      {!jobsResult && (
        <div className="empty-jobs">
          <Icon d={Icons.search} size={40} />
          <p>No job results yet</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Go to Analyse and click "Find Matching Jobs"
          </p>
        </div>
      )}

      {jobsResult && (
        <div className="jobs-grid">
          {jobsResult.jobs.map((job, i) => (
            <div
              key={i}
              className="job-card"
              style={{ animationDelay: `${i * 60}ms`, cursor: "pointer" }}
              onClick={() => setSelectedJob(job)}
            >
              <div className="job-card-header">
                <div>
                  <p className="job-title">{job.title}</p>
                  <p className="job-company">{job.company}</p>
                </div>
                {job.employment_type && (
                  <span className="job-type">
                    {job.employment_type.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              {job.location && (
                <div className="job-meta">
                  <span className="job-meta-item">
                    <Icon d={Icons.location} size={13} />
                    {job.location}
                  </span>
                </div>
              )}
              {job.matched_role && (
                <span className="job-role-tag">
                  Matched for: {job.matched_role}
                </span>
              )}
              {job.required_skills?.length > 0 && (
                <div className="job-skills">
                  {job.required_skills.slice(0, 3).map((s, j) => (
                    <span key={j} className="job-skill-tag">
                      {s.length > 40 ? s.slice(0, 40) + "..." : s}
                    </span>
                  ))}
                </div>
              )}
              {job.description && (
                <p className="job-desc">{job.description}...</p>
              )}
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn"
                onClick={(e) => e.stopPropagation()}
              >
                Apply Now <Icon d={Icons.arrow} size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
