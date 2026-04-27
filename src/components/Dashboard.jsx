import Badge from "./ui/Badge.jsx";
import { matchQualityLabel } from "../utils/dreamFeatures.js";
import { primaryMatchReason } from "../utils/matchAlgorithm.js";

// ---------------------------------------------------------------------------
// PENDING MATCH CARD
// ---------------------------------------------------------------------------

function PendingMatchCard({ match, otherUser, onAccept, onDecline }) {
  const quality = matchQualityLabel(match.score);
  const reason  = primaryMatchReason({
    reasons:   match.reasons   || [],
    breakdown: match.breakdown || {},
    score:     match.score,
  });

  const badgeVariant = { gold: "gold", cyan: "blue", blue: "blue", muted: "muted" }[quality.color] ?? "muted";

  return (
    <div className="match-card animate-in">

      <div className="match-card__header">
        <div className="score-ring score-ring--blue">
          {Math.round(match.score)}
        </div>
        <div className="stack stack--sm" style={{ flex: 1 }}>
          <div className="match-card__user">
            matched with <span>@{otherUser?.username ?? "unknown"}</span>
          </div>
          <div className="cluster cluster--sm">
            <Badge variant={badgeVariant}>{quality.label}</Badge>
            {match.eeriness > 0.3 && <Badge variant="gold">⬡ rare</Badge>}
          </div>
        </div>
      </div>

      <div className="match-card__body">
        {reason && (
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
            Matched on:{" "}
            <span style={{ color: "var(--text-primary)", fontStyle: "italic" }}>
              {reason}
            </span>
          </p>
        )}

        {match.reasons && match.reasons.length > 0 && (
          <div className="match-card__reasons">
            {match.reasons.slice(0, 5).map((r, i) => (
              <Badge key={i} variant="muted">{r}</Badge>
            ))}
          </div>
        )}

        {match.eeriness > 0 && (
          <div style={{ marginTop: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <span style={{
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                Improbability
              </span>
              <span style={{
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                color: "var(--accent-gold)",
              }}>
                {Math.round(match.eeriness * 100)}%
              </span>
            </div>
            <div className="eeriness-bar">
              <div className="eeriness-bar__fill" style={{ width: `${match.eeriness * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="match-card__actions">
        <button
          className="btn btn--primary"
          style={{ fontSize: "0.8rem", padding: "0.4rem 1rem" }}
          onClick={onAccept}
        >
          Accept connection
        </button>
        <button
          className="btn btn--ghost"
          style={{ fontSize: "0.8rem", padding: "0.4rem 1rem" }}
          onClick={onDecline}
        >
          Decline
        </button>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// ACCEPTED MATCH CARD
// ---------------------------------------------------------------------------

function AcceptedMatchCard({ match, otherUser }) {
  const reason = primaryMatchReason({
    reasons:   match.reasons   || [],
    breakdown: match.breakdown || {},
    score:     match.score,
  });

  return (
    <div className="match-card card--match animate-in">

      <div className="match-card__header">
        <div className="score-ring score-ring--green">
          {Math.round(match.score)}
        </div>
        <div className="stack stack--sm" style={{ flex: 1 }}>
          <div className="match-card__user">
            connected with{" "}
            <span style={{ color: "var(--accent-green)" }}>
              @{otherUser?.username ?? "unknown"}
            </span>
          </div>
          <Badge variant="green">Confirmed</Badge>
        </div>
      </div>

      <div className="match-card__body">
        {reason && (
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            Anchor:{" "}
            <span style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>
              {reason}
            </span>
          </p>
        )}
        {match.reasons && match.reasons.length > 1 && (
          <div className="match-card__reasons">
            {match.reasons.slice(1, 5).map((r, i) => (
              <Badge key={i} variant="muted">{r}</Badge>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------------------------

export default function Dashboard({ currentUser, myMatches, dreamById, userById, onSetStatus }) {
  const pending  = myMatches.filter((m) => m.status === "pending");
  const accepted = myMatches.filter((m) => m.status === "accepted");

  return (
    <div className="stack stack--xl">

      {/* Welcome */}
      <div className="animate-in">
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "2rem",
          marginBottom: "0.3rem",
        }}>
          Welcome, {currentUser.username}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {pending.length > 0
            ? `${pending.length} new match${pending.length !== 1 ? "es" : ""} found.`
            : "No pending matches. Submit a dream to find connections."}
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <div className="section-header">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
              New matches
            </h3>
            <span className="section-header__count">{pending.length}</span>
          </div>
          <div className="stack stack--md">
            {pending.map((m) => (
              <PendingMatchCard
                key={m.id}
                match={m}
                otherUser={userById(m.matchedWithUserId)}
                onAccept={() => onSetStatus(m.id, "accepted")}
                onDecline={() => onSetStatus(m.id, "rejected")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Accepted */}
      {accepted.length > 0 && (
        <div>
          <div className="section-header">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
              Confirmed connections
            </h3>
            <span className="section-header__count">{accepted.length}</span>
          </div>
          <div className="stack stack--md">
            {accepted.map((m) => (
              <AcceptedMatchCard
                key={m.id}
                match={m}
                otherUser={userById(m.matchedWithUserId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pending.length === 0 && accepted.length === 0 && (
        <div className="card animate-in animate-in--delay-1">
          <div className="empty-state">
            <div className="empty-state__icon">☾</div>
            <p className="empty-state__title">No matches yet</p>
            <p className="empty-state__body">
              Submit a dream and the system will search for structural overlap with others.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}