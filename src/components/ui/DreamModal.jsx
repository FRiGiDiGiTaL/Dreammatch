export default function DreamModal({ dream, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {dream.title}
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="badge">{dream.dreamType === 'good' ? '✨ Positive' : dream.dreamType === 'nightmare' ? '😱 Nightmare' : dream.dreamType === 'lucid' ? '🔮 Lucid' : dream.dreamType === 'prophetic' ? '🌟 Prophetic' : dream.dreamType === 'surreal' ? '🌀 Surreal' : '😴 Neutral'}</span>
          <span className="badge">{dream.isPublic ? "🌍 Public" : "🔒 Private"}</span>
          {dream.isRecurring && <span className="badge">🔁 Recurring</span>}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-cyan-400 mb-2">📖 Description</h3>
            <p className="text-slate-300 leading-relaxed">{dream.fullDescription}</p>
          </div>

          {dream.keywords?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-cyan-400 mb-2">🏷️ Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {dream.keywords.map((kw, i) => (
                  <span key={i} className="badge text-xs">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {dream.places?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-cyan-400 mb-2">📍 Locations</h3>
              <p className="text-slate-300">{dream.places.join(", ")}</p>
            </div>
          )}

          {dream.names?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-cyan-400 mb-2">👥 Characters</h3>
              <p className="text-slate-300">{dream.names.join(", ")}</p>
            </div>
          )}

          {dream.animals?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-cyan-400 mb-2">🦁 Creatures</h3>
              <p className="text-slate-300">{dream.animals.join(", ")}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-500/20">
            <div>
              <p className="text-xs text-slate-500 uppercase">⏰ Time Woken</p>
              <p className="text-slate-300 font-semibold">{dream.timeOfWaking}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">📅 Date</p>
              <p className="text-slate-300 font-semibold">
                {new Date(dream.createdAt).toLocaleDateString()} {new Date(dream.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {dream.isRecurring && dream.recurringFrequency && (
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <p className="text-xs text-slate-500 uppercase">🔁 Frequency</p>
              <p className="text-slate-300 font-semibold">{dream.recurringFrequency}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}