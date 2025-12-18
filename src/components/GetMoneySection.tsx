"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, MOCKPKR_ABI } from "@/constants";
import { formatUnits } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GetMoneySection() {
  const { address } = useAccount();

  // Read balance
  const { data: balance, refetch } = useReadContract({
    address: CONTRACTS.MockPKR,
    abi: MOCKPKR_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Faucet transaction
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFaucet = () => {
    writeContract({
      address: CONTRACTS.MockPKR,
      abi: MOCKPKR_ABI,
      functionName: "faucet",
    });
  };

  // Refetch balance on success
  if (isSuccess) {
    refetch();
  }

  return (
    <Card className="border-2 border-emerald-200 shadow-lg">
      <CardHeader className="bg-linear-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Coins className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Get Test Tokens</CardTitle>
              <CardDescription className="text-base">
                Claim free mPKR tokens to test the platform
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            Faucet
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-lg p-6 text-center border-2 border-emerald-100">
          <p className="text-sm text-gray-600 mb-2 flex items-center justify-center gap-2">
            <Wallet className="h-4 w-4" />
            Your Balance
          </p>
          <p className="text-5xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {balance ? Number(formatUnits(balance, 18)).toLocaleString() : "0"}
          </p>
          <p className="text-lg text-gray-600 mt-2 font-semibold">mPKR</p>
        </div>

        <Button
          onClick={handleFaucet}
          disabled={!address || isPending || isConfirming}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {isConfirming ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Confirming Transaction...
            </>
          ) : isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Requesting from Faucet...
            </>
          ) : (
            <>
              <Coins className="mr-2 h-5 w-5" />
              Claim 100,000 mPKR
            </>
          )}
        </Button>

        {isSuccess && (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700 font-medium">
              Success! 100,000 mPKR tokens have been added to your wallet
            </AlertDescription>
          </Alert>
        )}

        {!address && (
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to use the faucet
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
