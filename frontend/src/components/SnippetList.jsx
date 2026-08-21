import { useState } from "react";
import api from "../api/axios.js";

export default function SnippetList({ snippets, setSnippets }) {
  const [analyzingId, setAnalyzingId] = useState(null);

  async function handleAnalyze(id) {
    setAnalyzingId(id);
    try {
      const res = await api.post(`/code/${id}/analyze`);
      // update just that one snippet's feedback in our list
      setSnippets((prev) =>
        prev.map((s) => (s._id === id ? { ...s, aiFeedback: res.data.feedback } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this snippet?")) return;
    await api.delete(`/code/${id}`);
    setSnippets((prev) => prev.filter((s) => s._id !== id));
  }

  if (snippets.length === 0) {
    return <p className="muted">No saved code yet. Write something above!</p>;
  }

  return (
    <div className="snippet-list">
      {snippets.map((snippet) => (
        <div className="card snippet-card" key={snippet._id}>
          <div className="snippet-header">
            <h4>{snippet.title || "Untitled Snippet"}</h4>
            <span className="badge">{snippet.language}</span>
          </div>

          <pre className="code-preview">{snippet.code}</pre>

          {snippet.aiFeedback && (
            <div className="ai-feedback">
              <strong>AI Mentor Feedback:</strong>
              <p>{snippet.aiFeedback}</p>
            </div>
          )}

          <div className="snippet-actions">
            <button
              onClick={() => handleAnalyze(snippet._id)}
              disabled={analyzingId === snippet._id}
            >
              {analyzingId === snippet._id ? "Analyzing..." : "Analyze with AI"}
            </button>
            <button className="danger" onClick={() => handleDelete(snippet._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
