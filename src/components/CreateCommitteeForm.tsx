"use client";

import { useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, QAMETIHUB_ABI } from "@/constants";
import { parseUnits, isAddress } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Plus,
  Users,
  Clock,
  Coins,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validation schema with comprehensive rules
const committeeFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    })
    .refine((val) => Number(val) >= 100, {
      message: "Amount must be at least 100 mPKR for meaningful contributions",
    })
    .refine((val) => Number(val) <= 1000000000, {
      message: "Amount exceeds reasonable maximum (1 billion mPKR)",
    })
    .refine(
      (val) => {
        const num = Number(val);
        return num === Math.floor(num);
      },
      {
        message: "Amount must be a whole number (no decimals)",
      }
    ),

  duration: z
    .string()
    .min(1, "Duration is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Duration must be a positive number",
    })
    .refine((val) => Number(val) >= 60, {
      message:
        "Duration must be at least 60 seconds (1 minute) for fair rounds",
    })
    .refine((val) => Number(val) <= 2592000, {
      message: "Duration cannot exceed 30 days (2,592,000 seconds)",
    })
    .refine(
      (val) => {
        const num = Number(val);
        return num === Math.floor(num);
      },
      {
        message: "Duration must be a whole number of seconds",
      }
    ),

  participants: z
    .string()
    .min(1, "At least 2 participant addresses are required")
    .refine(
      (val) => {
        const addresses = val
          .split(",")
          .map((addr) => addr.trim())
          .filter(Boolean);
        return addresses.length >= 2;
      },
      {
        message:
          "You must enter at least 2 participant addresses (ROSCA requires multiple participants)",
      }
    )
    .refine(
      (val) => {
        const addresses = val
          .split(",")
          .map((addr) => addr.trim())
          .filter(Boolean);
        return addresses.length <= 50;
      },
      {
        message: "Maximum 50 participants allowed to ensure gas efficiency",
      }
    )
    .refine(
      (val) => {
        const addresses = val
          .split(",")
          .map((addr) => addr.trim())
          .filter(Boolean);
        return addresses.every((addr) => isAddress(addr));
      },
      {
        message:
          "All addresses must be valid Ethereum addresses (starting with 0x followed by 40 hex characters)",
      }
    )
    .refine(
      (val) => {
        const addresses = val
          .split(",")
          .map((addr) => addr.trim())
          .filter(Boolean);
        const uniqueAddresses = new Set(
          addresses.map((addr) => addr.toLowerCase())
        );
        return uniqueAddresses.size === addresses.length;
      },
      {
        message:
          "Duplicate addresses detected. Each participant must have a unique address",
      }
    )
    .refine(
      (val) => {
        const addresses = val
          .split(",")
          .map((addr) => addr.trim())
          .filter(Boolean);
        return addresses.every(
          (addr) => addr !== "0x0000000000000000000000000000000000000000"
        );
      },
      {
        message: "Zero address (0x0000...) is not allowed as a participant",
      }
    ),
});

type CommitteeFormData = z.infer<typeof committeeFormSchema>;

export default function CreateCommitteeForm() {
  const { address } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    watch,
  } = useForm<CommitteeFormData>({
    resolver: zodResolver(committeeFormSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      amount: "1000",
      duration: "120",
      participants: "",
    },
  });

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Watch form values for dynamic feedback
  const participantsValue = watch("participants");
  const participantCount = participantsValue
    ? participantsValue
        .split(",")
        .map((addr) => addr.trim())
        .filter(Boolean).length
    : 0;

  // Reset form on successful transaction
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        reset();
      }, 5000); // Clear form after 5 seconds to allow user to see success message
    }
  }, [isSuccess, reset]);

  const onSubmit = (data: CommitteeFormData) => {
    const participantAddresses = data.participants
      .split(",")
      .map((addr) => addr.trim() as `0x${string}`)
      .filter((addr) => addr.length > 0);

    writeContract({
      address: CONTRACTS.QametiHub,
      abi: QAMETIHUB_ABI,
      functionName: "createCommittee",
      args: [
        participantAddresses,
        parseUnits(data.amount, 18),
        BigInt(data.duration),
      ],
    });
  };

  return (
    <Card className="border-2">
      <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Create Committee</CardTitle>
            <CardDescription className="text-base">
              Start a new ROSCA with friends
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Wallet Connection Warning */}
          {!address && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet using the button in the top-right
                corner to create a committee.
              </AlertDescription>
            </Alert>
          )}

          {/* Amount Field */}
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Coins className="h-4 w-4" />
              Amount Per Round (mPKR) *
            </Label>
            <Input
              id="amount"
              type="number"
              {...register("amount")}
              placeholder="1000"
              className={`h-12 text-lg ${errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              disabled={isPending || isConfirming}
            />
            {errors.amount && (
              <Alert variant="destructive" className="py-2">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.amount.message}
                </AlertDescription>
              </Alert>
            )}
            {!errors.amount && touchedFields.amount && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                Each participant contributes this amount per round
              </p>
            )}
            {!touchedFields.amount && (
              <p className="text-sm text-muted-foreground">
                Minimum: 100 mPKR • Recommended: 1,000 - 10,000 mPKR
              </p>
            )}
          </div>

          {/* Duration Field */}
          <div className="space-y-2">
            <Label
              htmlFor="duration"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Round Duration (seconds) *
            </Label>
            <Input
              id="duration"
              type="number"
              {...register("duration")}
              placeholder="120"
              className={`h-12 text-lg ${errors.duration ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              disabled={isPending || isConfirming}
            />
            {errors.duration && (
              <Alert variant="destructive" className="py-2">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.duration.message}
                </AlertDescription>
              </Alert>
            )}
            {!errors.duration && touchedFields.duration && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                Time for each round before pot distribution
              </p>
            )}
            {!touchedFields.duration && (
              <p className="text-sm text-muted-foreground">
                Quick demo: 120s (2 min) • Testing: 300s (5 min) • Production:
                604,800s (7 days)
              </p>
            )}
          </div>

          {/* Participants Field */}
          <div className="space-y-2">
            <Label
              htmlFor="participants"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Participant Addresses *
              {participantCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({participantCount}{" "}
                  {participantCount === 1 ? "address" : "addresses"} entered)
                </span>
              )}
            </Label>
            <textarea
              id="participants"
              {...register("participants")}
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,&#10;0x1234567890123456789012345678901234567890,&#10;0xABCDEF1234567890ABCDEF1234567890ABCDEF12"
              className={`w-full min-h-25 px-3 py-2 text-sm rounded-md border ${
                errors.participants ? "border-red-500" : "border-input"
              } bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ${
                errors.participants
                  ? "focus-visible:ring-red-500"
                  : "focus-visible:ring-ring"
              } focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono`}
              disabled={isPending || isConfirming}
            />
            {errors.participants && (
              <Alert variant="destructive" className="py-2">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.participants.message}
                </AlertDescription>
              </Alert>
            )}
            {!errors.participants && participantCount >= 2 && (
              <Alert className="py-2 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-700">
                  Valid! {participantCount} unique participants ready for ROSCA
                </AlertDescription>
              </Alert>
            )}
            {!errors.participants && participantCount === 1 && (
              <Alert className="py-2 border-yellow-200 bg-yellow-50">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm text-yellow-700">
                  Need at least one more participant (currently have 1)
                </AlertDescription>
              </Alert>
            )}
            {!errors.participants && participantCount === 0 && (
              <p className="text-sm text-muted-foreground">
                Enter Ethereum addresses separated by commas or new lines • Min:
                2 • Max: 50
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!address || isPending || isConfirming || !isValid}
            className="w-full h-12 text-lg font-semibold"
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
                Creating Committee...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Create Committee
              </>
            )}
          </Button>

          {/* Success Message */}
          {isSuccess && hash && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-700 font-semibold">
                Committee Created Successfully!
              </AlertTitle>
              <AlertDescription className="text-emerald-600 space-y-2">
                <p>Your ROSCA committee has been deployed to the blockchain.</p>
                <p className="text-xs font-mono break-all">
                  Transaction: {hash}
                </p>
                <p className="text-sm">
                  Check your transaction on Etherscan to find the committee
                  contract address.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Transaction Error */}
          {(writeError || receiptError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Transaction Failed</AlertTitle>
              <AlertDescription className="space-y-1">
                <p>
                  {writeError?.message ||
                    receiptError?.message ||
                    "An error occurred while creating the committee."}
                </p>
                <p className="text-xs mt-2">
                  Common issues: Insufficient gas, network congestion, or
                  rejected transaction.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Helper Info */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-700 text-sm font-semibold">
              Quick Start Guide
            </AlertTitle>
            <AlertDescription className="text-blue-600 text-xs space-y-1">
              <p>
                1. Enter amount each participant will contribute (e.g., 1000
                mPKR)
              </p>
              <p>2. Set round duration (120 seconds = 2 minutes for testing)</p>
              <p>3. Add at least 2 Ethereum addresses (including yours)</p>
              <p>4. Click "Create Committee" and confirm the transaction</p>
              <p className="mt-2 font-semibold">
                💡 Tip: Copy the contract address from the transaction to
                interact with it!
              </p>
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  );
}
