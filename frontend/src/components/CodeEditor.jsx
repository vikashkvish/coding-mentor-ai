import { useState } from "react";
import api from "../api/axios.js";

export default function CodeEditor({ onSaved }) {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!code.trim()) {
      setError("Please write some code first");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await api.post("/code", { title, language, code });
      setTitle("");
      setCode("");
      onSaved(res.data); // tell the parent page a new snippet was saved
    } catch (err) {
      setError(err.response?.data?.message || "Could not save code");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h3>Write / Save Code</h3>

      <input
        type="text"
        placeholder="Title (e.g. Two Sum Problem)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="other">Other</option>
      </select>

      <textarea
        rows={10}
        placeholder="Paste or write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="code-textarea"
      />

      {error && <p className="error-text">{error}</p>}

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Code"}
      </button>
    </div>
  );
}
