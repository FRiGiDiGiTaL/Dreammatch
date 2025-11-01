// src/components/ui/Badge.jsx
export default function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-sm font-medium ${className}`}>
      {children}
    </span>
  );
}