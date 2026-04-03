import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { Badge } from "../../components/ui/Badge";
import { StatCard } from "../../components/ui/StatCard";
import { sendRegistryTransaction } from "../../lib/identityRegistry";

export function AdminDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);
  const [identities, setIdentities] = useState([]);

  async function refresh() {
    setAuditLogs(await apiFetch("/audit-logs").catch(() => []));
    setIdentities(await apiFetch("/identities").catch(() => []));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function setVerifierRole() {
    await apiFetch("/auth/role", {
      method: "POST",
      body: JSON.stringify({ walletAddress, role: "org" })
    });
    try {
      await sendRegistryTransaction("grantVerifierRole", walletAddress);
    } catch {
      // Role grant can still be demoed from API if contract is not configured.
    }
    setWalletAddress("");
    refresh();
  }

  async function revoke(did) {
    await apiFetch(`/identities/${did}/revoke`, { method: "POST", body: JSON.stringify({}) });
    try {
      await sendRegistryTransaction("revokeIdentity", did);
    } catch {
      // API state remains usable for offline demo.
    }
    refresh();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Authorized Identities" value={identities.length} hint="Lifecycle governance" />
        <StatCard label="Audit Events" value={auditLogs.length} hint="Tamper-evident operations log" />
        <StatCard label="Verifier Roles" value="Dynamic" hint="Grant to banks and institutions" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-2xl text-white">Verifier Management</h2>
          <input
            value={walletAddress}
            onChange={(event) => setWalletAddress(event.target.value)}
            placeholder="Verifier wallet address"
            className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
          />
          <button onClick={setVerifierRole} className="mt-4 rounded-full bg-teal-400 px-5 py-3 font-semibold text-slate-950">
            Grant Organization Role
          </button>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-2xl text-white">Identity Control Panel</h2>
          <div className="mt-6 space-y-3">
            {identities.map((identity) => (
              <div key={identity.did} className="flex flex-col gap-3 rounded-3xl border border-white/10 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="break-all text-white">{identity.did}</p>
                  <p className="text-sm text-slate-400">{identity.fullName} • {identity.walletAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge value={identity.status} />
                  <button onClick={() => revoke(identity.did)} className="rounded-full bg-rose-500/20 px-4 py-2 text-sm text-rose-300">
                    Revoke
                  </button>
                </div>
              </div>
            ))}
            {!identities.length && <p className="text-sm text-slate-400">No identities yet.</p>}
          </div>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-6">
        <h2 className="font-display text-2xl text-white">Audit Logs</h2>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-white">{log.action}</td>
                  <td className="px-4 py-3 text-slate-400">{log.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
