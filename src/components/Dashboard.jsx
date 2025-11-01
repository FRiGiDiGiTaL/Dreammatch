// src/components/Dashboard.jsx
import Card from "./ui/Card";
import EmptyState from "./ui/EmptyState";
import Badge from "./ui/Badge";

export default function Dashboard({ currentUser, myMatches, dreamById, userById, onSetStatus }) {
  const pendingMatches = myMatches.filter((m) => m.status === "pending");
  const acceptedMatches = myMatches.filter((m) => m.status === "accepted");

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, {currentUser.username}!</h2>
        <p className="text-slate-600">
          You have {pendingMatches.length} pending match{pendingMatches.length !== 1 ? "es" : ""}.
        </p>
      </Card>

      {pendingMatches.length === 0 && acceptedMatches.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon="💭"
            title="No Matches Yet"
            message="Submit a dream to find connections with other dreamers."
          />
        </Card>
      ) : (
        <>
          {pendingMatches.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3">Pending Matches</h3>
              <div className="space-y-3">
                {pendingMatches.map((match) => {
                  const dream = dreamById(match.dreamId);
                  const otherUser = userById(match.matchedWithUserId);
                  return (
                    <Card key={match.id} className="p-4">
                      <p className="font-semibold text-indigo-600 mb-2">{otherUser?.username}</p>
                      <p className="text-sm text-slate-700 mb-3">{dream?.title}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSetStatus(match.id, "accepted")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onSetStatus(match.id, "rejected")}
                          className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg text-sm hover:bg-slate-400"
                        >
                          Decline
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {acceptedMatches.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3">Accepted Matches</h3>
              <div className="space-y-3">
                {acceptedMatches.map((match) => {
                  const dream = dreamById(match.dreamId);
                  const otherUser = userById(match.matchedWithUserId);
                  return (
                    <Card key={match.id} className="p-4 border-2 border-green-400">
                      <p className="font-semibold text-green-600 mb-1">✓ Connected with {otherUser?.username}</p>
                      <p className="text-sm text-slate-700">{dream?.title}</p>
                      <Badge className="mt-3">Match Score: {Math.round(match.score)}</Badge>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}