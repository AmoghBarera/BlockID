import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { Badge } from "../../components/ui/Badge";
import { StatCard } from "../../components/ui/StatCard";
import { sendRegistryTransaction } from "../../lib/identityRegistry";

export function OrganizationDashboard() {
  const [did, setDid] = useState("");
  const [requests, setRequests] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    apiFetch("/requests").then(setRequests).catch(() => {});
  }, []);

  async function searchIdentity() {
    const result = await apiFetch(`/identities/${did}`);
    setSearchResult(result);
  }

  async function requestVerification() {
    await apiFetch("/requests", {
      method: "POST",
      body: JSON.stringify({
        did,
        organizationName: "Demo Bank",
        purpose: "KYC for high-value account opening"
      })
    });
    try {
      await sendRegistryTransaction("requestVerification", did);
    } catch {
      // Backend request remains available for local demo without a deployed contract.
    }
    setRequests(await apiFetch("/requests"));
  }

  async function finalize(requestId, approved) {
    const result = await apiFetch(`/requests/${requestId}/verify`, {
      method: "POST",
      body: JSON.stringify({ approved, remarks: approved ? "All proofs matched" : "Proof mismatch" })
    });
    try {
      await sendRegistryTransaction("verifyIdentity", result.identity.did, approved, approved ? "All proofs matched" : "Proof mismatch");
    } catch {
      // Contract write is optional until a live address is configured.
    }
    setRequests(await apiFetch("/requests"));
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pending Reviews" value={requests.filter((item) => item.status !== "VERIFIED").length} hint="Institution pipeline" />
        <StatCard label="Verified Cases" value={requests.filter((item) => item.status === "VERIFIED").length} hint="Reusable trust layer" />
        <StatCard label="Use Cases" value="4" hint="Bank, College, Govt, Commerce" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-2xl text-white">Search DID</h2>
          <input
            value={did}
            onChange={(event) => setDid(event.target.value)}
            placeholder="did:blockid:..."
            className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
          />
          <div className="mt-4 flex gap-3">
            <button onClick={searchIdentity} className="rounded-full bg-teal-400 px-5 py-3 font-semibold text-slate-950">
              Search
            </button>
            <button onClick={requestVerification} className="rounded-full bg-white/10 px-5 py-3 text-white">
              Request Verification
            </button>
          </div>
          {searchResult && (
            <div className="mt-6 rounded-3xl border border-white/10 p-4">
              <p className="break-all text-teal-200">{searchResult.did}</p>
              <div className="mt-3">
                <Badge value={searchResult.status} />
              </div>
              <p className="mt-3 text-sm text-slate-300">Proof hash: {searchResult.proofHash}</p>
              <p className="mt-2 text-sm text-slate-400">Selective claims: ageOver18, collegeVerified</p>
            </div>
          )}
        </div>

        <div className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-2xl text-white">Verifier Queue</h2>
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">DID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{request.organizationName}</td>
                    <td className="px-4 py-3 text-slate-400">{request.did.slice(0, 18)}...</td>
                    <td className="px-4 py-3"><Badge value={request.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => finalize(request.id, true)} className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                          Verify
                        </button>
                        <button onClick={() => finalize(request.id, false)} className="rounded-full bg-rose-500/20 px-3 py-1 text-rose-300">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
