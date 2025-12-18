"use client";

import Navbar from "@/components/Navbar";
import GetMoneySection from "@/components/GetMoneySection";
import CreateCommitteeForm from "@/components/CreateCommitteeForm";
import ActiveCommitteesSection from "@/components/ActiveCommitteesSection";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 space-y-4">
          <Badge variant="secondary" className="mb-4 text-sm">
            🎓 University Blockchain Demo
          </Badge>
          <h1 className="text-6xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            QametiAunty
          </h1>
          <p className="text-2xl font-semibold text-gray-700">
            Decentralized ROSCA Platform
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A blockchain-powered Rotating Savings and Credit Association. Save
            together, build trust, and manage committee funds transparently.
          </p>
          <div className="flex gap-2 justify-center flex-wrap mt-4">
            <Badge variant="outline">Sepolia Testnet</Badge>
            <Badge variant="outline">Smart Contracts</Badge>
            <Badge variant="outline">RainbowKit</Badge>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Get Money Section - Full Width */}
        <GetMoneySection />

        <Separator className="my-8" />

        {/* Two Column Layout - Responsive */}
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="create">Create Committee</TabsTrigger>
            <TabsTrigger value="view">View Committee</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="create" className="space-y-4">
              <CreateCommitteeForm />
            </TabsContent>

            <TabsContent value="view" className="space-y-4">
              <ActiveCommitteesSection />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center space-y-2">
          <p className="text-sm font-medium text-gray-700">
            🎓 University Blockchain Demo Project
          </p>
          <p className="text-xs text-gray-500">
            Built with Hardhat • Next.js • Wagmi • RainbowKit • shadcn/ui
          </p>
          <Badge variant="secondary" className="mt-2">
            Sepolia Testnet
          </Badge>
        </div>
      </footer>
    </div>
  );
}

export default App;
