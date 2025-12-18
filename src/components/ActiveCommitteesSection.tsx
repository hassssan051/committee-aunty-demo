"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, FileText, Info } from "lucide-react";

export default function ActiveCommitteesSection() {
  const [committeeAddress, setCommitteeAddress] = useState("");
  const router = useRouter();

  const handleLoadCommittee = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAddress(committeeAddress)) {
      alert("Please enter a valid Ethereum address");
      return;
    }

    router.push(`/committee/${committeeAddress}`);
  };

  return (
    <Card className="border-2">
      <CardHeader className="bg-linear-to-r from-green-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Active Committees</CardTitle>
            <CardDescription className="text-base">
              View and interact with existing ROSCAs
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleLoadCommittee} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="committee-address"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Committee Contract Address
            </Label>
            <Input
              id="committee-address"
              type="text"
              value={committeeAddress}
              onChange={(e) => setCommitteeAddress(e.target.value)}
              placeholder="0x..."
              className="h-12 text-lg font-mono"
              required
            />
            <p className="text-sm text-muted-foreground">
              Paste the committee contract address to view and interact
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            <Search className="mr-2 h-5 w-5" />
            Load Committee
          </Button>
        </form>

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Tip:</strong> After creating a committee, copy its address
            from the transaction and paste it here to interact with it.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
