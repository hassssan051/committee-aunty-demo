import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";

import { config } from "../wagmi";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QametiAunty - ROSCA Demo",
  description:
    "Decentralized Rotating Savings and Credit Association on Sepolia",
};

export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    config,
    (await headers()).get("cookie")
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>{props.children}</Providers>
      </body>
    </html>
  );
}
