import api from "../api/axios.js";

// Short catalog-style codes, like a course catalog listing (DSA·101, ML·201...)
const PATH_CODES = {
  dsa: "DSA · 101",
  "machine-learning": "ML · 201",
  "java-developer": "JAVA · 301",
  "mern-fullstack": "MERN · 401",
};

export default function PathCard({ pathKey, pathData, progress, setProgress }) {
  // Find whether a topic is completed by looking through the student's progress list
  function isCompleted(topic) {
    const entry = progress.find((p) => p.path === pathKey && p.topic === topic);
    return entry ? entry.completed : false;
  }

  async function toggleTopic(topic) {
    const completed = !isCompleted(topic);
    const res = await api.put("/progress/toggle", { path: pathKey, topic, completed });

    setProgress((prev) => {
      const others = prev.filter((p) => !(p.path === pathKey && p.topic === topic));
      return [...others, res.data];
    });
  }

  const completedCount = pathData.topics.filter((t) => isCompleted(t)).length;
  const total = pathData.topics.length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <div className="card path-card">
      <div className="path-tab">{PATH_CODES[pathKey] || pathKey.toUpperCase()}</div>

      <div className="path-body">
        <div className="path-header">
          <h3>{pathData.name}</h3>
          <span className="badge">{completedCount}/{total} done</span>
        </div>

        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>

        <ul className="topic-list">
          {pathData.topics.map((topic, index) => (
            <li key={topic}>
              <label>
                <input
                  type="checkbox"
                  checked={isCompleted(topic)}
                  onChange={() => toggleTopic(topic)}
                />
                <span className="topic-index">{String(index + 1).padStart(2, "0")}</span>
                <span className={isCompleted(topic) ? "topic-done" : ""}>{topic}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}