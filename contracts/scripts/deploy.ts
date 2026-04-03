import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("IdentityRegistry");
  const contract = await factory.deploy(deployer.address);
  await contract.waitForDeployment();

  console.log("IdentityRegistry deployed to:", await contract.getAddress());
  console.log("Admin wallet:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
