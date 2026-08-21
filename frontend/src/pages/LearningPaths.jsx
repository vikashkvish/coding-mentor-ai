import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PathCard from "../components/PathCard.jsx";

export default function LearningPaths() {
  const [paths, setPaths] = useState({});
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [pathsRes, progressRes] = await Promise.all([
          api.get("/paths"),
          api.get("/progress"),
        ]);
        setPaths(pathsRes.data || {});
        setProgress(progressRes.data || []);
      } catch (err) {
        console.error("Failed to load learning paths", err);
        setError("Could not load learning paths. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page error-text">{error}</div>;

  return (
    <div className="page">
      <h1>Learning Paths</h1>
      <p className="muted">Tick off topics as you complete them. Your progress is saved automatically.</p>

      <div className="path-grid">
        {Object.entries(paths).map(([key, data]) => (
          <PathCard
            key={key}
            pathKey={key}
            pathData={data}
            progress={progress}
            setProgress={setProgress}
          />
        ))}
      </div>
    </div>
  );
}