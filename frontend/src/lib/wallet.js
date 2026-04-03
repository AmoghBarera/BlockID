import { BrowserProvider } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return {
    provider,
    signer,
    walletAddress: accounts[0]
  };
}

export async function signMessage(signer, message) {
  return signer.signMessage(message);
}
