import Badge from "./ui/Badge.jsx";

export default function Journal({ dreams }) {
  if (dreams.length === 0) {
    return (
      <div className="stack stack--lg">
        <div className="animate-in">
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "2rem", marginBottom: "0.3rem" }}>
            Your journal
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Dreams you have submitted will appear here.
          </p>
        </div>
        <div className="card animate-in animate-in--delay-1">
          <div className="empty-state">
            <div className="empty-state__icon">📖</div>
            <p className="empty-state__title">No dreams recorded</p>
            <p className="empty-state__body">Submit your first dream to begin the journal.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack stack--lg">
      <div className="animate-in">
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "2rem", marginBottom: "0.3rem" }}>
          Your journal
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {dreams.length} dream{dreams.length !== 1 ? "s" : ""} recorded.
        </p>
      </div>

      <div className="stack stack--md">
        {dreams.map((dream, i) => (
          <div
            key={dream.id}
            className={`dream-entry animate-in animate-in--delay-${Math.min(i + 1, 3)}`}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <p className="dream-entry__date">
                {new Date(dream.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
              <div className="cluster cluster--sm">
                {dream.isRecurring && <Badge variant="gold">recurring</Badge>}
                <Badge variant={dream.isPublic ? "blue" : "muted"}>
                  {dream.isPublic ? "public" : "private"}
                </Badge>
              </div>
            </div>

            {dream.emotionalTone && (
              <p className="dream-entry__tone">{dream.emotionalTone}</p>
            )}

            {dream.rawDescription && (
              <p className="dream-entry__description">{dream.rawDescription}</p>
            )}

            <div className="dream-entry__tags">
              {dream.environments?.slice(0, 3).map((e, i) => (
                <Badge key={`env-${i}`} variant="muted">{e}</Badge>
              ))}
              {dream.anchors?.filter(a => a).slice(0, 2).map((a, i) => (
                <Badge key={`anc-${i}`} variant="gold">{a}</Badge>
              ))}
              {dream.structuralType && (
                <Badge variant="muted">{dream.structuralType}</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}