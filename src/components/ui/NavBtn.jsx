// src/components/ui/NavBtn.jsx
export default function NavBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl transition-colors ${
        active
          ? "bg-indigo-500 text-white"
          : "text-slate-300 hover:bg-slate-100/10"
      }`}
    >
      {children}
    </button>
  );
}