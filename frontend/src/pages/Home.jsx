import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page hero">
      <span className="hero-eyebrow">Your syllabus, one checkbox at a time</span>
      <h1>Coding Mentor AI</h1>
      <p>
        Save your code, get instant AI-powered hints instead of full answers,
        and work through structured paths in DSA, Machine Learning, Java, and
        MERN Full Stack — with every completed topic saved to your account.
      </p>

      {user ? (
        <Link to="/dashboard" className="btn-link">
          Go to Dashboard
        </Link>
      ) : (
        <div className="hero-buttons">
          <Link to="/register" className="btn-link">
            Get Started
          </Link>
          <Link to="/login" className="btn-link secondary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}