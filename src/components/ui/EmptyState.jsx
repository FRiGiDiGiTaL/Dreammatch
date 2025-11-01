// src/components/ui/EmptyState.jsx
export default function EmptyState({ icon = "📭", title, message }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-slate-500">{message}</p>
    </div>
  );
}