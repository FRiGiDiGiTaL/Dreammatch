// src/components/ui/Tag.jsx
export default function Tag({ children, onRemove, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-200 text-indigo-900 text-sm ${className}`}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-indigo-700 font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
}