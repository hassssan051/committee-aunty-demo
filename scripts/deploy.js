const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Sepolia...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy MockPKR Token
  console.log("📦 Deploying MockPKR token...");
  const MockPKR = await hre.ethers.getContractFactory("MockPKR");
  const mockPKR = await MockPKR.deploy();
  await mockPKR.waitForDeployment();
  const mockPKRAddress = await mockPKR.getAddress();
  console.log("✅ MockPKR deployed to:", mockPKRAddress);

  // Deploy QametiHub
  console.log("\n📦 Deploying QametiHub factory...");
  const QametiHub = await hre.ethers.getContractFactory("QametiHub");
  const qametiHub = await QametiHub.deploy(
    mockPKRAddress,
    deployer.address // Admin address (deployer for demo)
  );
  await qametiHub.waitForDeployment();
  const qametiHubAddress = await qametiHub.getAddress();
  console.log("✅ QametiHub deployed to:", qametiHubAddress);

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   MockPKR Token:", mockPKRAddress);
  console.log("   QametiHub Factory:", qametiHubAddress);
  console.log("\n📝 Next Steps:");
  console.log("   1. Verify contracts on Etherscan:");
  console.log(`      npx hardhat verify --network sepolia ${mockPKRAddress}`);
  console.log(
    `      npx hardhat verify --network sepolia ${qametiHubAddress} ${mockPKRAddress} ${deployer.address}`
  );
  console.log("\n   2. Update your frontend with these addresses");
  console.log("\n   3. Get test tokens:");
  console.log(`      Call faucet() on MockPKR at ${mockPKRAddress}`);
  console.log("\n" + "=".repeat(60) + "\n");

  // Save deployment info to a file
  const fs = require("fs");
  const deploymentInfo = {
    network: "sepolia",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MockPKR: mockPKRAddress,
      QametiHub: qametiHubAddress,
    },
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment-info.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
