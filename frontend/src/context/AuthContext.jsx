import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { connectWallet, signMessage } from "../lib/wallet";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("blockid_session");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem("blockid_session", JSON.stringify(session));
    }
  }, [session]);

  async function login() {
    setLoading(true);
    try {
      const { signer, walletAddress } = await connectWallet();
      const { nonce } = await apiFetch("/auth/nonce", {
        method: "POST",
        body: JSON.stringify({ walletAddress })
      });
      const signature = await signMessage(signer, `BlockID authentication nonce: ${nonce}`);
      const { token } = await apiFetch("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ walletAddress, signature })
      });
      localStorage.setItem("blockid_token", token);
      setSession({ walletAddress, token });
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("blockid_token");
    localStorage.removeItem("blockid_session");
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
