export default function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl bg-white text-slate-900 shadow-2xl shadow-indigo-950/30 border border-indigo-900/20 ${className}`}
    >
      {children}
    </section>
  );
}
