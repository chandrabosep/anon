"use client";

import { useAccount } from "wagmi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row max-w-screen-2xl mx-auto w-full py-4">
      <main>{children}</main>
    </div>
  );
}
