import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <section className="grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
        <div className="glass rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Decentralized Identity Verification</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-tight text-white md:text-6xl">
            Reusable, privacy-first digital identity for banks, colleges, and government services.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            BlockID combines wallet signatures, encrypted off-chain metadata, IPFS-backed documents, and on-chain proofs
            so identity can be verified without exposing personal data.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/user" className="rounded-full bg-teal-400 px-5 py-3 font-semibold text-slate-950">
              Register Identity
            </Link>
            <Link to="/organization" className="rounded-full border border-white/15 px-5 py-3 text-white">
              Explore Verification
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Bank KYC", "Reduce onboarding friction with reusable identity proofing."],
            ["College Validation", "Validate SRN or PRN-based student status instantly."],
            ["Government Services", "Verify applicants without central data silos."]
          ].map(([title, text]) => (
            <div key={title} className="glass rounded-3xl p-5">
              <h3 className="font-display text-xl text-white">{title}</h3>
              <p className="mt-3 text-sm text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-[2rem] p-8">
        <h2 className="font-display text-2xl text-white">Why This Architecture Works</h2>
        <ul className="mt-6 space-y-4 text-sm text-slate-300">
          <li>Only proofs and status live on-chain.</li>
          <li>Wallet signatures replace passwords.</li>
          <li>IPFS content hashes guarantee tamper detection.</li>
          <li>Role-based verification keeps institutions accountable.</li>
          <li>OTP challenge adds a practical second factor for demo-ready security.</li>
        </ul>
      </div>
    </section>
  );
}
