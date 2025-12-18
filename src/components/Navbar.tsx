"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-3xl transform group-hover:scale-110 transition-transform">
              🎭
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                QametiAunty
              </span>
              <span className="text-xs text-gray-500">ROSCA Platform</span>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Sepolia
            </Badge>
          </Link>

          {/* Connect Button */}
          <div className="flex items-center gap-4">
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
        </div>
      </div>
    </nav>
  );
}
