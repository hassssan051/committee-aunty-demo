"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, MockPKR_ABI } from "@/contracts";
import { formatUnits, parseUnits } from "viem";
import { useState } from "react";

export default function FaucetCard() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Read token balance
  const { data: balance, refetch } = useReadContract({
    address: CONTRACTS.MockPKR as `0x${string}`,
    abi: MockPKR_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Write contract for faucet
  const { data: hash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFaucet = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      writeContract({
        address: CONTRACTS.MockPKR as `0x${string}`,
        abi: MockPKR_ABI,
        functionName: "faucet",
      });
    } catch (error) {
      console.error("Faucet error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch balance when transaction succeeds
  if (isSuccess) {
    refetch();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">💰 Token Faucet</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Your Balance:</p>
        <p className="text-3xl font-bold text-green-600">
          {balance ? formatUnits(balance as bigint, 18) : "0"} mPKR
        </p>
      </div>

      <button
        onClick={handleFaucet}
        disabled={!address || isLoading || isConfirming}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        {isConfirming
          ? "Confirming..."
          : isLoading
            ? "Requesting..."
            : "Get 100,000 mPKR"}
      </button>

      {isSuccess && (
        <p className="mt-3 text-sm text-green-600 text-center">
          ✅ Success! Tokens received.
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500 text-center">
        Click to receive 100,000 Mock PKR tokens for testing
      </p>
    </div>
  );
}
