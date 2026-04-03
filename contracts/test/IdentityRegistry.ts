import { expect } from "chai";
import { ethers } from "hardhat";

describe("IdentityRegistry", function () {
  it("registers and verifies an identity", async function () {
    const [admin, user, verifier] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("IdentityRegistry");
    const contract = await factory.deploy(admin.address);
    await contract.waitForDeployment();

    await contract.connect(user).registerIdentity("did:blockid:test", "cid://demo", "0xproof");
    await contract.grantVerifierRole(verifier.address);
    await contract.connect(user).requestVerification("did:blockid:test");
    await contract.connect(verifier).verifyIdentity("did:blockid:test", true, "KYC ok");

    const identity = await contract.getIdentity("did:blockid:test");
    expect(identity.did).to.equal("did:blockid:test");
    expect(identity.status).to.equal(3n);
  });
});
