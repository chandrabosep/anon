"use client";

import { useAccount } from "wagmi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen">
      <>{children}</>
    </div>
  );
}
