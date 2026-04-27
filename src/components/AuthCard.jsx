import { useState } from "react";

export default function AuthCard({ onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(username, password);
      } else {
        await onLogin(username, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card animate-in">

        <p className="auth-title">
          {isRegister ? "Begin" : "Return"}
        </p>
        <p className="auth-subtitle">
          {isRegister
            ? "Your first dream is waiting to find its match."
            : "Someone, somewhere, has had your dream."}
        </p>

        <form onSubmit={handleSubmit} className="stack stack--md">
          <div className="field">
            <label className="field-label">Username</label>
            <input
              type="text"
              className="input"
              placeholder="a name only you know"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary btn--full btn--large"
            style={{ marginTop: "0.25rem" }}
          >
            {loading ? "…" : isRegister ? "Create account" : "Enter"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          marginTop: "1.25rem",
        }}>
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-blue)",
              cursor: "pointer",
              fontSize: "inherit",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </p>

        <p style={{
          textAlign: "center",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          marginTop: "1rem",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.05em",
        }}>
          All data stored locally. No tracking.
        </p>

      </div>
    </div>
  );
}