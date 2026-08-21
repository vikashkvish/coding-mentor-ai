import { useEffect, useState } from "react";
import api from "../api/axios.js";
import CodeEditor from "../components/CodeEditor.jsx";
import SnippetList from "../components/SnippetList.jsx";

export default function Dashboard() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSnippets() {
      try {
        const res = await api.get("/code");
        setSnippets(res.data);
      } catch (err) {
        console.error("Failed to load snippets", err);
      } finally {
        setLoading(false);
      }
    }
    loadSnippets();
  }, []);

  function handleSaved(newSnippet) {
    setSnippets((prev) => [newSnippet, ...prev]);
  }

  return (
    <div className="page">
      <h1>Your Dashboard</h1>
      <p className="muted">Save your code and get instant AI mentor feedback.</p>

      <CodeEditor onSaved={handleSaved} />

      <h2>Your Saved Code</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <SnippetList snippets={snippets} setSnippets={setSnippets} />
      )}
    </div>
  );
}
