"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS, QametiHub_ABI } from "@/contracts";
import CommitteeCard from "./CommitteeCard";

export default function CommitteeList() {
  const { data: committees, isLoading } = useReadContract({
    address: CONTRACTS.QametiHub as `0x${string}`,
    abi: QametiHub_ABI,
    functionName: "getAllCommittees",
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          📋 All Committees
        </h2>
        <p className="text-gray-600">Loading committees...</p>
      </div>
    );
  }

  if (!committees || (committees as readonly string[]).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          📋 All Committees
        </h2>
        <p className="text-gray-600">
          No committees created yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📋 All Committees</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(committees as readonly string[]).map((address: string) => (
          <CommitteeCard key={address} address={address} />
        ))}
      </div>
    </div>
  );
}
