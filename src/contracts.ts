// Contract addresses - Update these after deployment
export const CONTRACTS = {
  MockPKR: process.env.NEXT_PUBLIC_MOCKPKR_ADDRESS || "",
  QametiHub: process.env.NEXT_PUBLIC_QAMETIHUB_ADDRESS || "",
} as const;

// ABIs
export const MockPKR_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function faucet()",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;

export const QametiHub_ABI = [
  "function admin() view returns (address)",
  "function tokenAddress() view returns (address)",
  "function committees(uint256) view returns (address)",
  "function creatorCommittees(address, uint256) view returns (address)",
  "function createCommittee(address[] participants, uint256 amountPerRound, uint256 roundDuration) returns (address)",
  "function getAllCommittees() view returns (address[])",
  "function getCommitteesByCreator(address creator) view returns (address[])",
  "function getCommitteesCount() view returns (uint256)",
  "event CommitteeCreated(address indexed committeeAddress, address indexed creator, address[] participants, uint256 amountPerRound, uint256 roundDuration)",
] as const;

export const QametiCommittee_ABI = [
  "function token() view returns (address)",
  "function participants(uint256) view returns (address)",
  "function amountPerRound() view returns (uint256)",
  "function roundDuration() view returns (uint256)",
  "function currentRound() view returns (uint256)",
  "function roundStartTime() view returns (uint256)",
  "function admin() view returns (address)",
  "function hasPaid(uint256 round, address participant) view returns (bool)",
  "function hasReceivedPayout(address) view returns (bool)",
  "function contribute()",
  "function distributePot()",
  "function allParticipantsPaid() view returns (bool)",
  "function isParticipant(address) view returns (bool)",
  "function getParticipantsCount() view returns (uint256)",
  "function getParticipants() view returns (address[])",
  "function getCurrentWinner() view returns (address)",
  "function getCommitteeInfo() view returns (uint256 currentRound, uint256 totalRounds, uint256 amountPerRound, uint256 roundDuration, uint256 roundStartTime, bool allPaid)",
  "event Contribution(address indexed participant, uint256 round, uint256 amount)",
  "event PotDistributed(uint256 round, address indexed winner, uint256 amount, uint256 fee)",
  "event RoundAdvanced(uint256 newRound, uint256 startTime)",
] as const;
