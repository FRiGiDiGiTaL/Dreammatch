// src/components/Journal.jsx
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import EmptyState from "./ui/EmptyState";

export default function Journal({ dreams }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Dreams</h2>
      {dreams.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon="📖"
            title="No Dreams Yet"
            message="Start by submitting your first dream."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {dreams.map((dream) => (
            <Card key={dream.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-indigo-600 mb-1">{dream.title}</h3>
                  <p className="text-sm text-slate-700 mb-2">{dream.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {dream.tags?.map((tag, i) => (
                      <Badge key={i} className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Badge className="ml-3">
                  {dream.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {new Date(dream.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}