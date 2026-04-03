import { BrowserProvider, Contract } from "ethers";

const contractAbi = [
  "function registerIdentity(string did,string metadataCID,string proofHash)",
  "function requestVerification(string did)",
  "function verifyIdentity(string did,bool approved,string remarks)",
  "function grantVerifierRole(address verifier)",
  "function revokeIdentity(string did)",
  "function getIdentity(string did) view returns (tuple(address wallet,string did,string metadataCID,string proofHash,uint256 registeredAt,uint256 updatedAt,uint8 status,bool exists))"
];

export async function getRegistryContract() {
  if (!window.ethereum) throw new Error("MetaMask not available");
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress || /^0x0+$/.test(contractAddress)) {
    throw new Error("Set VITE_CONTRACT_ADDRESS after deployment");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(contractAddress, contractAbi, signer);
}

export async function sendRegistryTransaction(method, ...args) {
  const contract = await getRegistryContract();
  const tx = await contract[method](...args);
  await tx.wait();
  return tx.hash;
}
