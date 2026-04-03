const styles = {
  VERIFIED: "bg-emerald-500/20 text-emerald-300",
  REGISTERED: "bg-blue-500/20 text-blue-300",
  PENDING_USER_APPROVAL: "bg-amber-500/20 text-amber-300",
  APPROVED_BY_USER: "bg-cyan-500/20 text-cyan-300",
  REJECTED: "bg-rose-500/20 text-rose-300",
  REVOKED: "bg-slate-500/20 text-slate-300"
};

export function Badge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[value] || "bg-white/10 text-white"}`}>
      {value}
    </span>
  );
}
