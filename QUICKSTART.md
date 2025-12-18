# 🚀 Quick Start Guide - QametiAunty

## ⚡ 5-Minute Setup

### 1. Prerequisites Check

```bash
node --version  # Should be v18 or higher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
# Windows
copy .env.example .env

# Edit .env and add:
# - NEXT_PUBLIC_ALCHEMY_API_KEY (from https://dashboard.alchemy.com/)
# - PRIVATE_KEY (your wallet private key WITHOUT 0x prefix)
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (from https://cloud.walletconnect.com/)
```

### 4. Compile Contracts

```bash
npx hardhat compile
```

Expected output:

```
Compiled 13 Solidity files successfully
```

### 5. Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Important:** Save the contract addresses from the output!

### 6. Update .env with Deployed Addresses

```env
NEXT_PUBLIC_MOCKPKR_ADDRESS=0x... (from deployment output)
NEXT_PUBLIC_QAMETIHUB_ADDRESS=0x... (from deployment output)
```

### 7. Run the App

```bash
npm run dev
```

Open http://localhost:3000

---

## 🎮 Quick Demo Flow

1. **Connect Wallet** → Click "Connect Wallet" button
2. **Get Tokens** → Click "Get 100,000 mPKR" in faucet
3. **Create Committee** → Add 2+ addresses, set amount & duration
4. **Contribute** → Approve tokens, then contribute
5. **Wait** → Let round timer expire
6. **Distribute** → Click "Distribute Pot" button

---

## 📦 What Got Built

### Smart Contracts (Solidity)

- ✅ `MockPKR.sol` - ERC20 token with faucet
- ✅ `QametiCommittee.sol` - ROSCA logic
- ✅ `QametiHub.sol` - Factory contract

### Frontend (Next.js + React)

- ✅ FaucetCard - Get test tokens
- ✅ CreateCommitteeForm - Create new committees
- ✅ CommitteeCard - View and interact with committees
- ✅ CommitteeList - Browse all committees
- ✅ Wallet connection (Wagmi)

### Configuration

- ✅ Hardhat setup for Sepolia
- ✅ TypeScript configuration
- ✅ TailwindCSS styling
- ✅ Environment variable management

---

## 🔍 Project Structure

```
committee-auntie-demo/
│
├── contracts/              # Solidity smart contracts
│   ├── MockPKR.sol        # ERC20 token (100k faucet)
│   ├── QametiCommittee.sol # ROSCA committee logic
│   └── QametiHub.sol      # Factory for committees
│
├── scripts/
│   └── deploy.js          # Deployment script
│
├── src/
│   ├── app/
│   │   └── page.tsx       # Main UI
│   ├── components/        # React components
│   │   ├── FaucetCard.tsx
│   │   ├── CreateCommitteeForm.tsx
│   │   ├── CommitteeCard.tsx
│   │   └── CommitteeList.tsx
│   ├── contracts.ts       # ABIs and addresses
│   └── wagmi.ts          # Wagmi configuration
│
├── hardhat.config.js      # Hardhat configuration
├── .env.example          # Environment template
├── README.md             # Full documentation
└── DEPLOYMENT.md         # Deployment checklist
```

---

## ⚙️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Run production build

# Hardhat
npx hardhat compile     # Compile contracts
npx hardhat clean       # Clear cache
npx hardhat node        # Run local node
npx hardhat test        # Run tests (if created)

# Deployment
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🐛 Troubleshooting

### "Module not found" errors

```bash
npm install
```

### Compilation fails

```bash
npx hardhat clean
npx hardhat compile
```

### Deployment fails

- Check you have Sepolia ETH
- Verify PRIVATE_KEY in .env (no 0x prefix)
- Verify NEXT_PUBLIC_ALCHEMY_API_KEY is correct

### Frontend not connecting

- Check contract addresses in .env
- Ensure MetaMask is on Sepolia network
- Try refreshing the page

---

## 📚 Learn More

- **Full Documentation**: See README.md
- **Deployment Guide**: See DEPLOYMENT.md
- **Hardhat Docs**: https://hardhat.org/
- **Wagmi Docs**: https://wagmi.sh/
- **OpenZeppelin**: https://docs.openzeppelin.com/

---

## 🎓 Educational Purpose

This is a **university blockchain demo project** showcasing:

- ✅ Smart contract development
- ✅ ERC20 token standards
- ✅ Factory pattern
- ✅ Web3 frontend integration
- ✅ ROSCA financial model on blockchain

**Not for production use** - Educational purposes only!

---

## 🆘 Need Help?

1. Check README.md for detailed docs
2. Review DEPLOYMENT.md checklist
3. Verify .env configuration
4. Check Sepolia ETH balance
5. Review error messages in console

---

**Built with ❤️ for Blockchain Education**

Good luck with your demo! 🎭

---

# DEPRECATED

This document has been deprecated and consolidated into `README.md`. Please refer to `README.md` for the canonical, concise project overview and quick start guide.
