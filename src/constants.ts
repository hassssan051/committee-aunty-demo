// Contract addresses - Update these after deployment
export const CONTRACTS = {
  MockPKR: (process.env.NEXT_PUBLIC_MOCKPKR_ADDRESS || "") as `0x${string}`,
  QametiHub: (process.env.NEXT_PUBLIC_QAMETIHUB_ADDRESS || "") as `0x${string}`,
} as const;

// MockPKR ABI
export const MOCKPKR_ABI = [
  {
    inputs: [],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// QametiHub ABI
export const QAMETIHUB_ABI = [
  {
    inputs: [
      { name: "_tokenAddress", type: "address" },
      { name: "_admin", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { name: "_participants", type: "address[]" },
      { name: "_amountPerRound", type: "uint256" },
      { name: "_roundDuration", type: "uint256" },
    ],
    name: "createCommittee",
    outputs: [{ name: "committeeAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllCommittees",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_creator", type: "address" }],
    name: "getCommitteesByCreator",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "committeeAddress", type: "address" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "participants", type: "address[]" },
      { indexed: false, name: "amountPerRound", type: "uint256" },
      { indexed: false, name: "roundDuration", type: "uint256" },
    ],
    name: "CommitteeCreated",
    type: "event",
  },
] as const;

// QametiCommittee ABI
export const QAMETICOMMITTEE_ABI = [
  {
    inputs: [],
    name: "currentRound",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "roundDuration",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "roundStartTime",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "amountPerRound",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getParticipants",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" },
    ],
    name: "hasPaid",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "distributePot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "allParticipantsPaid",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentWinner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCommitteeInfo",
    outputs: [
      { name: "_currentRound", type: "uint256" },
      { name: "_totalRounds", type: "uint256" },
      { name: "_amountPerRound", type: "uint256" },
      { name: "_roundDuration", type: "uint256" },
      { name: "_roundStartTime", type: "uint256" },
      { name: "_allPaid", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "participant", type: "address" },
      { indexed: false, name: "round", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Contribution",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "round", type: "uint256" },
      { indexed: true, name: "winner", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "fee", type: "uint256" },
    ],
    name: "PotDistributed",
    type: "event",
  },
] as const;
