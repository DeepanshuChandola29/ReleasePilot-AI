
import React, { useState } from "react";
import api from "../services/api";
import "./ReleaseAnalysis.css";

function ReleaseAnalysis() {
  const [form, setForm] = useState({
    owner: "DeepanshuChandola29",
    repo: "ai-driven-cicd-pipeline",
    base: "main",
    head: "main",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const analyzeRelease = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post(
        "/api/release/analyze",
        form
      );

      setResult(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to analyse release."
      );
    } finally {
      setLoading(false);
    }
  };

  const riskClass =
    result?.risk_analysis?.risk_level?.toLowerCase();

  return (
    <div className="release-analysis">
      <div className="analysis-header">
        <div>
          <h1>Release Risk Analysis</h1>
          <p>
            Compare GitHub commits and predict deployment
            risk using AI.
          </p>
        </div>
      </div>

      <div className="analysis-card">
        <h2>GitHub Repository Details</h2>

        <form onSubmit={analyzeRelease}>
          <div className="analysis-form-grid">
            <div className="analysis-field">
              <label>GitHub Owner</label>
              <input
                name="owner"
                value={form.owner}
                onChange={handleChange}
                required
                placeholder="GitHub username"
              />
            </div>

            <div className="analysis-field">
              <label>Repository Name</label>
              <input
                name="repo"
                value={form.repo}
                onChange={handleChange}
                required
                placeholder="Repository name"
              />
            </div>

            <div className="analysis-field">
              <label>Base Commit / Branch</label>
              <input
                name="base"
                value={form.base}
                onChange={handleChange}
                required
                placeholder="main"
              />
            </div>

            <div className="analysis-field">
              <label>Head Commit / Branch</label>
              <input
                name="head"
                value={form.head}
                onChange={handleChange}
                required
                placeholder="feature-branch"
              />
            </div>
          </div>

          <button
            type="submit"
            className="analyze-button"
            disabled={loading}
          >
            {loading ? "Analyzing Release..." : "Analyze Release"}
          </button>
        </form>

        {error && (
          <div className="analysis-error">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="analysis-results">
          <div className="risk-result-card">
            <span>Predicted Release Risk</span>

            <h2 className={`risk-${riskClass}`}>
              {result.risk_analysis.risk_level}
            </h2>

            <p>
              Prediction Confidence:{" "}
              {result.risk_analysis.prediction_confidence ?? "N/A"}%
            </p>
          </div>

          <div className="analysis-stats">
            <div className="analysis-stat-card">
              <span>Commits</span>
              <h2>{result.total_commits}</h2>
            </div>

            <div className="analysis-stat-card">
              <span>Files Changed</span>
              <h2>{result.total_files_changed}</h2>
            </div>

            <div className="analysis-stat-card">
              <span>Lines Added</span>
              <h2>{result.total_additions}</h2>
            </div>

            <div className="analysis-stat-card">
              <span>Lines Deleted</span>
              <h2>{result.total_deletions}</h2>
            </div>
          </div>

          <div className="analysis-card">
            <h2>Risk Indicators</h2>

            <ul>
              {result.risk_analysis.reasons.map(
                (reason, index) => (
                  <li key={index}>{reason}</li>
                )
              )}
            </ul>

            <h3>Sensitive Files</h3>

            {result.risk_analysis.sensitive_files.length > 0 ? (
              <ul>
                {result.risk_analysis.sensitive_files.map(
                  (file, index) => (
                    <li key={index}>{file}</li>
                  )
                )}
              </ul>
            ) : (
              <p>No sensitive files detected.</p>
            )}
          </div>

          <div className="analysis-card">
            <h2>Deployment Recommendation</h2>
            <p>{result.risk_analysis.recommendation}</p>
          </div>

          <div className="analysis-card">
            <h2>Changed Files</h2>

            {result.changed_files.length > 0 ? (
              <div className="changed-files-table">
                <table>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Status</th>
                      <th>Additions</th>
                      <th>Deletions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.changed_files.map((file, index) => (
                      <tr key={index}>
                        <td>{file.filename}</td>
                        <td>{file.status}</td>
                        <td>{file.additions}</td>
                        <td>{file.deletions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No files changed between these references.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReleaseAnalysis;
