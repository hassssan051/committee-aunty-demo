"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, QametiCommittee_ABI, MockPKR_ABI } from "@/contracts";
import { formatUnits } from "viem";
import { useState, useEffect } from "react";

interface CommitteeCardProps {
  address: string;
}

export default function CommitteeCard({
  address: committeeAddress,
}: CommitteeCardProps) {
  const { address: userAddress } = useAccount();
  const [needsApproval, setNeedsApproval] = useState(false);

  // Read committee info
  const { data: committeeInfo, refetch: refetchInfo } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QametiCommittee_ABI,
    functionName: "getCommitteeInfo",
  });

  // Read participants
  const { data: participants } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QametiCommittee_ABI,
    functionName: "getParticipants",
  });

  // Read current winner
  const { data: currentWinner } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QametiCommittee_ABI,
    functionName: "getCurrentWinner",
  });

  // Check if user has paid
  const { data: hasPaid, refetch: refetchHasPaid } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QametiCommittee_ABI,
    functionName: "hasPaid",
    args:
      committeeInfo && userAddress
        ? [(committeeInfo as any)[0], userAddress]
        : undefined,
  });

  // Check token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.MockPKR as `0x${string}`,
    abi: MockPKR_ABI,
    functionName: "allowance",
    args: userAddress
      ? [userAddress, committeeAddress as `0x${string}`]
      : undefined,
  });

  // Approve token spending
  const { data: approveHash, writeContract: approve } = useWriteContract();
  const { isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Contribute to committee
  const { data: contributeHash, writeContract: contribute } =
    useWriteContract();
  const { isSuccess: isContributed } = useWaitForTransactionReceipt({
    hash: contributeHash,
  });

  // Distribute pot
  const { data: distributeHash, writeContract: distribute } =
    useWriteContract();
  const { isSuccess: isDistributed } = useWaitForTransactionReceipt({
    hash: distributeHash,
  });

  // Check if approval is needed
  useEffect(() => {
    if (committeeInfo && allowance !== undefined) {
      const amt = (committeeInfo as any)[2];
      setNeedsApproval((allowance as bigint) < amt);
    }
  }, [allowance, committeeInfo]);

  // Refetch data when transactions complete
  useEffect(() => {
    if (isApproved) {
      refetchAllowance();
    }
  }, [isApproved, refetchAllowance]);

  useEffect(() => {
    if (isContributed) {
      refetchHasPaid();
      refetchInfo();
    }
  }, [isContributed, refetchHasPaid, refetchInfo]);

  useEffect(() => {
    if (isDistributed) {
      refetchInfo();
    }
  }, [isDistributed, refetchInfo]);

  if (!committeeInfo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <p className="text-gray-600">Loading committee data...</p>
      </div>
    );
  }

  const committeeData = committeeInfo as any;
  const currentRound = committeeData[0];
  const totalRounds = committeeData[1];
  const amountPerRound = committeeData[2];
  const roundDuration = committeeData[3];
  const roundStartTime = committeeData[4];
  const allPaid = committeeData[5];

  const isParticipant = (participants as any)?.some(
    (p: string) => p.toLowerCase() === userAddress?.toLowerCase()
  );

  const handleApprove = () => {
    approve({
      address: CONTRACTS.MockPKR as `0x${string}`,
      abi: MockPKR_ABI,
      functionName: "approve",
      args: [committeeAddress as `0x${string}`, amountPerRound * BigInt(10)], // Approve for 10 rounds
    });
  };

  const handleContribute = () => {
    contribute({
      address: committeeAddress as `0x${string}`,
      abi: QametiCommittee_ABI,
      functionName: "contribute",
    });
  };

  const handleDistribute = () => {
    distribute({
      address: committeeAddress as `0x${string}`,
      abi: QametiCommittee_ABI,
      functionName: "distributePot",
    });
  };

  const timeRemaining =
    Number(roundStartTime) +
    Number(roundDuration) -
    Math.floor(Date.now() / 1000);
  const canDistribute = allPaid && timeRemaining <= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Committee</h3>
        <p className="text-xs text-gray-500 font-mono break-all">
          {committeeAddress}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Current Round</p>
          <p className="text-xl font-bold text-blue-600">
            {currentRound.toString()} / {totalRounds.toString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Amount Per Round</p>
          <p className="text-xl font-bold text-green-600">
            {formatUnits(amountPerRound, 18)} mPKR
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Round Duration</p>
          <p className="text-lg font-semibold text-gray-700">
            {roundDuration.toString()}s
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">All Paid?</p>
          <p className="text-lg font-semibold">
            {allPaid ? "✅ Yes" : "❌ No"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Current Winner</p>
        <p className="text-xs font-mono text-gray-700 break-all">
          {currentWinner?.toString() || "N/A"}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
        <p className="text-lg font-semibold text-orange-600">
          {timeRemaining > 0
            ? `${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`
            : "Ready to distribute!"}
        </p>
      </div>

      {isParticipant && (
        <div className="space-y-2">
          {needsApproval && !hasPaid && (
            <button
              onClick={handleApprove}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Approve Tokens
            </button>
          )}

          {!needsApproval && !hasPaid && (
            <button
              onClick={handleContribute}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Contribute {formatUnits(amountPerRound, 18)} mPKR
            </button>
          )}

          {Boolean(hasPaid) && (
            <p className="text-center text-green-600 font-semibold">
              ✅ You've paid for this round
            </p>
          )}
        </div>
      )}

      {canDistribute && (
        <button
          onClick={handleDistribute}
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Distribute Pot
        </button>
      )}

      {!isParticipant && userAddress && (
        <p className="text-center text-gray-500 text-sm">
          You are not a participant in this committee
        </p>
      )}
    </div>
  );
}
