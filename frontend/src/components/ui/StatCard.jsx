export function StatCard({ label, value, hint }) {
  return (
    <div className="glass rounded-3xl p-5 animate-floatUp">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-teal-200/80">{hint}</p>
    </div>
  );
}
