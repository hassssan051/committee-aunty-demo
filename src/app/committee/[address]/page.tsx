"use client";

import { use } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, MOCKPKR_ABI, QAMETICOMMITTEE_ABI } from "@/constants";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  Clock,
  Coins,
  Trophy,
  Check,
  X,
  CheckCircle2,
  XCircle,
  Unlock,
  Send,
  Gift,
  Info,
} from "lucide-react";

export default function CommitteePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address: committeeAddress } = use(params);
  const { address: userAddress } = useAccount();
  const [needsApproval, setNeedsApproval] = useState(false);

  // Read committee info
  const { data: committeeInfo, refetch: refetchInfo } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QAMETICOMMITTEE_ABI,
    functionName: "getCommitteeInfo",
  });

  // Read participants
  const { data: participants } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QAMETICOMMITTEE_ABI,
    functionName: "getParticipants",
  });

  // Read token address
  const { data: tokenAddress } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QAMETICOMMITTEE_ABI,
    functionName: "token",
  });

  // Read current winner
  const { data: currentWinner } = useReadContract({
    address: committeeAddress as `0x${string}`,
    abi: QAMETICOMMITTEE_ABI,
    functionName: "getCurrentWinner",
  });

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.MockPKR,
    abi: MOCKPKR_ABI,
    functionName: "allowance",
    args: userAddress
      ? [userAddress, committeeAddress as `0x${string}`]
      : undefined,
  });

  // Approve
  const { data: approveHash, writeContract: approve } = useWriteContract();
  const { isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Contribute
  const { data: contributeHash, writeContract: contribute } =
    useWriteContract();
  const { isSuccess: isContributed } = useWaitForTransactionReceipt({
    hash: contributeHash,
  });

  // Distribute
  const { data: distributeHash, writeContract: distribute } =
    useWriteContract();
  const { isSuccess: isDistributed } = useWaitForTransactionReceipt({
    hash: distributeHash,
  });

  // Check if approval needed
  useEffect(() => {
    if (committeeInfo && allowance !== undefined) {
      const amountPerRound = (committeeInfo as any)[2];
      setNeedsApproval((allowance as bigint) < amountPerRound);
    }
  }, [allowance, committeeInfo]);

  // Refetch on success
  useEffect(() => {
    if (isApproved) refetchAllowance();
  }, [isApproved, refetchAllowance]);

  useEffect(() => {
    if (isContributed || isDistributed) refetchInfo();
  }, [isContributed, isDistributed, refetchInfo]);

  if (!committeeInfo) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">
                Loading committee data...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const info = committeeInfo as any;
  const currentRound = info[0];
  const totalRounds = info[1];
  const amountPerRound = info[2];
  const roundDuration = info[3];
  const roundStartTime = info[4];
  const allPaid = info[5];

  const timeRemaining = Math.max(
    0,
    Number(roundStartTime) +
      Number(roundDuration) -
      Math.floor(Date.now() / 1000)
  );
  const canDistribute = allPaid && timeRemaining === 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="outline" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Committee Info Card */}
        <Card className="mb-8 border-2">
          <CardHeader className="bg-linear-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-3xl">Committee Dashboard</CardTitle>
            <CardDescription className="text-base font-mono break-all">
              {committeeAddress}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Current Round</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">
                    {currentRound.toString()} / {totalRounds.toString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Amount Per Round</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    {Number(formatUnits(amountPerRound, 18)).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">mPKR</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">Time Remaining</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-orange-600">
                    {timeRemaining > 0
                      ? `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, "0")}`
                      : "00:00"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    minutes:seconds
                  </p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Current Winner</h3>
              </div>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-4">
                  <p className="font-mono text-sm text-purple-700 break-all">
                    {currentWinner?.toString() || "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Participants Paid:
              </span>
              {allPaid ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  YES
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-4 w-4" />
                  NO
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Participants List */}
        <Card className="mb-8 border-2">
          <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl">Participants</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-3">
              {(participants as readonly `0x${string}`[])?.map(
                (participant, index) => {
                  const { data: hasPaid } = useReadContract({
                    address: committeeAddress as `0x${string}`,
                    abi: QAMETICOMMITTEE_ABI,
                    functionName: "hasPaid",
                    args: [currentRound, participant],
                  });

                  return (
                    <Card key={participant} className="border-2">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-base px-3">
                              #{index + 1}
                            </Badge>
                            <span className="font-mono text-sm">
                              {participant}
                            </span>
                          </div>

                          {hasPaid ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <Check className="mr-1 h-4 w-4" />
                              PAID
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <X className="mr-1 h-4 w-4" />
                              PENDING
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Panel */}
        {userAddress && (
          <Card className="border-2">
            <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Action Panel</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {(() => {
                const { data: userPaid } = useReadContract({
                  address: committeeAddress as `0x${string}`,
                  abi: QAMETICOMMITTEE_ABI,
                  functionName: "hasPaid",
                  args: [currentRound, userAddress],
                });

                if (userPaid) {
                  return (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700 font-semibold">
                        You have already paid for this round!
                      </AlertDescription>
                    </Alert>
                  );
                }

                if (needsApproval) {
                  return (
                    <div className="space-y-3">
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-700">
                          You need to approve the committee to spend your mPKR
                          tokens first.
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() =>
                          approve({
                            address: CONTRACTS.MockPKR,
                            abi: MOCKPKR_ABI,
                            functionName: "approve",
                            args: [
                              committeeAddress as `0x${string}`,
                              amountPerRound * BigInt(10),
                            ],
                          })
                        }
                        className="w-full h-12 text-lg"
                        variant="default"
                      >
                        <Unlock className="mr-2 h-5 w-5" />
                        Approve mPKR
                      </Button>
                    </div>
                  );
                }

                return (
                  <Button
                    onClick={() =>
                      contribute({
                        address: committeeAddress as `0x${string}`,
                        abi: QAMETICOMMITTEE_ABI,
                        functionName: "contribute",
                      })
                    }
                    className="w-full h-12 text-lg"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Contribute{" "}
                    {Number(
                      formatUnits(amountPerRound, 18)
                    ).toLocaleString()}{" "}
                    mPKR
                  </Button>
                );
              })()}

              {canDistribute && (
                <Button
                  onClick={() =>
                    distribute({
                      address: committeeAddress as `0x${string}`,
                      abi: QAMETICOMMITTEE_ABI,
                      functionName: "distributePot",
                    })
                  }
                  className="w-full h-12 text-lg bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Distribute Pot
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
