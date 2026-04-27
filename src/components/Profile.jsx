import Badge from "./ui/Badge.jsx";

export default function Profile({ user, dreams, matches, onDeleteAccount }) {
  const accepted = matches.filter(m => m.status === "accepted");
  const pending  = matches.filter(m => m.status === "pending");
  const anchored = dreams.filter(d => d.anchors?.some(a => a.trim()));

  const confirmDelete = () => {
    if (window.confirm("Delete your account? All local data will be erased.")) {
      localStorage.clear();
      onDeleteAccount();
    }
  };

  return (
    <div className="stack stack--xl">

      <div className="animate-in">
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "2rem", marginBottom: "0.3rem" }}>
          {user.username}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
          Member since {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
        </p>
      </div>

      {/* Stats */}
      <div className="card animate-in animate-in--delay-1">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "1.5rem" }}>
          <div className="profile-stat">
            <span className="profile-stat__value">{dreams.length}</span>
            <span className="profile-stat__label">Dreams</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{accepted.length}</span>
            <span className="profile-stat__label">Connections</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{pending.length}</span>
            <span className="profile-stat__label">Pending</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{anchored.length}</span>
            <span className="profile-stat__label">Anchored</span>
          </div>
        </div>
      </div>

      {/* Top anchors */}
      {anchored.length > 0 && (
        <div className="card card--gold animate-in animate-in--delay-2">
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent-gold)",
            marginBottom: "0.85rem",
          }}>
            Your anchors
          </p>
          <div className="cluster cluster--sm">
            {[...new Set(
              dreams.flatMap(d => d.anchors || []).filter(a => a.trim())
            )].slice(0, 12).map((anchor, i) => (
              <Badge key={i} variant="gold">{anchor}</Badge>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.85rem" }}>
            Rare elements detected across your dreams. These carry the highest matching weight.
          </p>
        </div>
      )}

      {/* Danger zone */}
      <div className="card animate-in animate-in--delay-3">
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "0.85rem",
        }}>
          Account
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
          All data is stored locally in your browser. Deleting your account permanently erases everything.
        </p>
        <button className="btn btn--danger" onClick={confirmDelete}>
          Delete account
        </button>
      </div>

    </div>
  );
}