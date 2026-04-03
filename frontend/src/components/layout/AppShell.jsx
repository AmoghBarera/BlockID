import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/user", label: "User" },
  { to: "/organization", label: "Organization" },
  { to: "/admin", label: "Admin" }
];

export function AppShell({ children }) {
  const { session, login, logout, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-white">
          BlockID
        </Link>
        <nav className="glass flex items-center gap-2 rounded-full px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm ${isActive ? "bg-teal-500 text-slate-950" : "text-slate-300"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        {session ? (
          <button onClick={logout} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">
            {session.walletAddress.slice(0, 6)}... Logout
          </button>
        ) : (
          <button
            onClick={login}
            disabled={loading}
            className="rounded-full bg-teal-400 px-5 py-2 text-sm font-semibold text-slate-950"
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-12">{children}</main>
    </div>
  );
}
