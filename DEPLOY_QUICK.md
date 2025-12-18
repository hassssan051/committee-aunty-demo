# Quick Deployment Guide

## Deploy Contracts to Sepolia

The `scripts/deploy.js` file is ready to deploy all contracts. Follow these steps:

### 1. Prerequisites

Ensure you have:

- Sepolia ETH in your wallet (get from https://sepoliafaucet.com/)
- Alchemy API key in your `.env` file
- Private key in your `.env` file

### 2. Run Deployment

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### What the Script Does

The deployment script will:

1. **Deploy MockPKR Token**
   - ERC20 token with public faucet
   - Allows anyone to mint 100,000 mPKR tokens

2. **Deploy QametiHub Factory**
   - Factory contract for creating committees
   - Takes MockPKR address and admin address as constructor params

3. **Save Deployment Info**
   - Creates `deployment-info.json` with addresses
   - Shows verification commands for Etherscan

### Expected Output

```
🚀 Starting deployment to Sepolia...

📝 Deploying contracts with account: 0x1234...5678
💰 Account balance: 0.5 ETH

📦 Deploying MockPKR token...
✅ MockPKR deployed to: 0xABCD...1234

📦 Deploying QametiHub factory...
✅ QametiHub deployed to: 0xEF12...5678

============================================================
🎉 DEPLOYMENT COMPLETE!
============================================================

📋 Contract Addresses:
   MockPKR Token: 0xABCD...1234
   QametiHub Factory: 0xEF12...5678
```

### 3. Update Environment Variables

After deployment, add the addresses to your `.env`:

```bash
NEXT_PUBLIC_MOCKPKR_ADDRESS=0xYourMockPKRAddress
NEXT_PUBLIC_QAMETIHUB_ADDRESS=0xYourQametiHubAddress
```

### 4. Update Frontend Constants

Edit `src/constants.ts`:

```typescript
export const MOCKPKR_ADDRESS = "0xYourMockPKRAddress" as const;
export const QAMETIHUB_ADDRESS = "0xYourQametiHubAddress" as const;
```

### 5. Verify on Etherscan (Optional)

```bash
# Verify MockPKR
npx hardhat verify --network sepolia <MockPKR_Address>

# Verify QametiHub
npx hardhat verify --network sepolia <QametiHub_Address> <MockPKR_Address> <Deployer_Address>
```

### 6. Test Your Deployment

```bash
npm run dev
```

Open http://localhost:3000 and:

1. Connect your wallet
2. Get test tokens from faucet
3. Create a committee
4. Test the full workflow

## Troubleshooting

### "Insufficient funds" error

You need Sepolia ETH for gas. Get more from: https://sepoliafaucet.com/

### "Invalid API Key" error

Check your `NEXT_PUBLIC_ALCHEMY_API_KEY` in `.env`

### "Network error"

Ensure your hardhat.config.js has the correct Alchemy URL

## Script Source Code

The deployment script is located at `scripts/deploy.js` and includes:

- Account balance check
- Sequential contract deployment
- Deployment info saving
- Verification command generation

## Security Notes

⚠️ **Never commit your `.env` file or private keys to git!**

The `.gitignore` already includes:

- `.env`
- `.env.local`
- `deployment-info.json`

---

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

DEPRECATED — consolidated into README.md. See `README.md` for the canonical, concise project overview and quick start.
