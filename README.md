# QametiAunty — ROSCA Demo (Sepolia)

A concise, production-minded demo of a blockchain-based ROSCA (Rotating Savings and Credit Association) implemented for education and prototyping on the Sepolia testnet.

![Emulation Diagram](./emulation_diagram.png)

## Summary

- **Purpose**: Demonstrate transparent, time-locked committee savings and payouts using smart contracts.
- **Audience**: Developers, educators, and auditors evaluating on-chain committee mechanics.

## Quick start

1. **Install**: `npm install`
2. **Configure**: copy `.env.example` → `.env` and add Alchemy / private key
3. **Local dev**: `npm run dev` (http://localhost:3000)
4. **Deploy (Sepolia)**: `npx hardhat run scripts/deploy.js --network sepolia`

## Contracts

- **MockPKR** (ERC-20 with faucet)
- **QametiHub** (Factory)
- **QametiCommittee** (Committee logic)

## Notes

- Testnet/demo only — not audited for mainnet
- Keep private keys out of source control

For full usage and developer notes see the repository files (tests, scripts, contracts).
