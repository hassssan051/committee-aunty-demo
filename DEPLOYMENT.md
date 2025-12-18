# 📋 QametiAunty Deployment Checklist

## Pre-Deployment

- [ ] Node.js v18+ installed
- [ ] MetaMask wallet set up
- [ ] Sepolia ETH in wallet (get from https://sepoliafaucet.com/)
- [ ] Alchemy account created (https://dashboard.alchemy.com/)
- [ ] WalletConnect project ID (https://cloud.walletconnect.com/)

## Environment Setup

- [ ] Copy `.env.example` to `.env`
- [ ] Add `NEXT_PUBLIC_ALCHEMY_API_KEY` to `.env`
- [ ] Add `PRIVATE_KEY` (without 0x) to `.env`
- [ ] Add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` to `.env`

## Smart Contract Deployment

- [ ] Run `npm install`
- [ ] Run `npx hardhat compile` (should compile 3 contracts)
- [ ] Verify hardhat.config.js has correct Sepolia RPC URL
- [ ] Run `npx hardhat run scripts/deploy.js --network sepolia`
- [ ] Save MockPKR address from deployment output
- [ ] Save QametiHub address from deployment output
- [ ] Add `NEXT_PUBLIC_MOCKPKR_ADDRESS` to `.env`
- [ ] Add `NEXT_PUBLIC_QAMETIHUB_ADDRESS` to `.env`

## Optional: Contract Verification

- [ ] Get Etherscan API key (https://etherscan.io/myapikey)
- [ ] Add to hardhat.config.js etherscan config
- [ ] Run verify command for MockPKR
- [ ] Run verify command for QametiHub

## Frontend Deployment

### Local Testing

- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Connect wallet
- [ ] Test faucet functionality
- [ ] Test committee creation

### Production Build

- [ ] Run `npm run build` (should succeed)
- [ ] Test production build with `npm start`

### Deploy to Vercel (Recommended)

- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_ALCHEMY_API_KEY`
  - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
  - `NEXT_PUBLIC_MOCKPKR_ADDRESS`
  - `NEXT_PUBLIC_QAMETIHUB_ADDRESS`
- [ ] Deploy

## Post-Deployment Testing

- [ ] Visit deployed site
- [ ] Connect wallet (MetaMask)
- [ ] Switch to Sepolia network
- [ ] Use faucet to get mPKR tokens
- [ ] Create a test committee with 2-3 addresses
- [ ] Approve tokens for committee
- [ ] Make contribution
- [ ] Wait for round duration
- [ ] Distribute pot

## Demo Preparation

- [ ] Prepare 3-5 test wallets with Sepolia ETH
- [ ] Create a demo committee with test wallets
- [ ] Have each wallet get faucet tokens
- [ ] Pre-approve tokens on all wallets
- [ ] Document the contract addresses for presentation
- [ ] Take screenshots of key features

## Troubleshooting

### Compilation Errors

- Clear cache: `npx hardhat clean`
- Delete node_modules and reinstall

### Deployment Fails

- Check Sepolia ETH balance
- Verify .env file is configured correctly
- Check Alchemy API key is valid

### Frontend Not Connecting

- Ensure MetaMask is on Sepolia network
- Check contract addresses are correct in .env
- Verify WalletConnect project ID

### Transactions Failing

- Ensure you have Sepolia ETH for gas
- Check if you approved token spending
- Verify contract addresses are correct

## Contract Addresses (Fill After Deployment)

```
Network: Sepolia Testnet
Deployed: [DATE]

MockPKR Token: 0x...
QametiHub Factory: 0x...

Etherscan Links:
MockPKR: https://sepolia.etherscan.io/address/0x...
QametiHub: https://sepolia.etherscan.io/address/0x...
```

## Demo Script

1. **Introduction** (2 min)
   - Explain ROSCA concept
   - Show QametiAunty homepage

2. **Token Faucet** (1 min)
   - Click faucet button
   - Show token balance update

3. **Create Committee** (2 min)
   - Enter participant addresses
   - Set amount and duration
   - Submit transaction

4. **Participate** (3 min)
   - Show committee card
   - Approve tokens
   - Make contribution
   - Show payment status

5. **Distribution** (2 min)
   - Wait for timer
   - Click distribute
   - Show winner receiving funds

Total: ~10 minutes

## Important Reminders

⚠️ **Never commit .env file**
⚠️ **Testnet only - not production ready**
⚠️ **Keep private keys secure**
⚠️ **Demo with small amounts**

## Resources

- Sepolia Faucet: https://sepoliafaucet.com/
- Alchemy Dashboard: https://dashboard.alchemy.com/
- Sepolia Explorer: https://sepolia.etherscan.io/
- MetaMask Support: https://support.metamask.io/

---

DEPRECATED — consolidated into README.md. See `README.md` for the canonical, concise project overview and quick start.
