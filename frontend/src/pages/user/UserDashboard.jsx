import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { Badge } from "../../components/ui/Badge";
import { StatCard } from "../../components/ui/StatCard";
import { sendRegistryTransaction } from "../../lib/identityRegistry";

export function UserDashboard() {
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    collegeId: "",
    email: "",
    phone: ""
  });
  const [identity, setIdentity] = useState(null);
  const [requests, setRequests] = useState([]);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch("/requests").then(setRequests).catch(() => {});
    apiFetch("/identities").then((items) => setIdentity(items[0] || null)).catch(() => {});
  }, []);

  async function submitForm(event) {
    event.preventDefault();
    const created = await apiFetch("/identities", {
      method: "POST",
      body: JSON.stringify(form)
    });
    try {
      const txHash = await sendRegistryTransaction("registerIdentity", created.did, created.metadataCid, created.proofHash);
      setMessage(`Identity registered on-chain. Tx: ${txHash.slice(0, 12)}...`);
    } catch (error) {
      setMessage(`Backend registration saved. Contract sync pending: ${error.message}`);
    }
    setIdentity(created);
  }

  async function approveRequest(requestId) {
    await apiFetch(`/requests/${requestId}/approve`, {
      method: "POST",
      body: JSON.stringify({ otp })
    });
    setMessage("Verification request approved. Verifier can now finalize on-chain.");
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Identity Status" value={identity?.status || "Not Registered"} hint="Wallet controlled DID" />
        <StatCard label="Verification Requests" value={requests.length} hint="Approval required from user" />
        <StatCard label="ZKP Claims" value={identity ? "2" : "0"} hint="Selective disclosure simulation" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submitForm} className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-2xl text-white">Register Identity</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["fullName", "Full Name"],
              ["dateOfBirth", "Date of Birth", "date"],
              ["collegeId", "College ID / SRN / PRN"],
              ["email", "Email", "email"],
              ["phone", "Phone", "tel"]
            ].map(([key, label, type = "text"]) => (
              <label key={key} className="text-sm text-slate-300">
                {label}
                <input
                  type={type}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none"
                />
              </label>
            ))}
          </div>
          <button className="mt-6 rounded-full bg-teal-400 px-5 py-3 font-semibold text-slate-950">
            Hash, Encrypt & Register
          </button>
          {message && <p className="mt-4 text-sm text-teal-200">{message}</p>}
        </form>

        <div className="space-y-6">
          <div className="glass rounded-[2rem] p-6">
            <h3 className="font-display text-xl text-white">Current DID</h3>
            {identity ? (
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="break-all text-teal-200">{identity.did}</p>
                <Badge value={identity.status} />
                <p>Metadata CID: {identity.metadataCid}</p>
                <p>Proof Hash: {identity.proofHash?.slice(0, 20)}...</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No identity registered yet.</p>
            )}
          </div>

          <div className="glass rounded-[2rem] p-6">
            <h3 className="font-display text-xl text-white">Verification Requests</h3>
            <input
              placeholder="Enter OTP shown in backend/demo"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
            />
            <div className="mt-4 space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-white/10 p-4">
                  <p className="text-white">{request.organizationName}</p>
                  <p className="text-sm text-slate-400">{request.purpose}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge value={request.status} />
                    <button
                      onClick={() => approveRequest(request.id)}
                      className="rounded-full bg-white/10 px-4 py-2 text-sm text-white"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              {!requests.length && <p className="text-sm text-slate-400">No requests yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
